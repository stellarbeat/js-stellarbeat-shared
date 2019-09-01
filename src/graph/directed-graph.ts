import {PublicKey} from "../network";
import {StronglyConnectedComponentsFinder, StronglyConnectedComponent} from "./strongly-connected-components-finder";
import {TransitiveQuorumSetFinder} from "./transitive-quorum-set-finder";

export class GraphQuorumSet {
    public threshold: number = 0;
    public validators: Array<PublicKey> = [];
    public innerGraphQuorumSets: Array<GraphQuorumSet> = [];
}

export class Vertex {
    public readonly publicKey: PublicKey;
    public readonly label: string;
    public readonly weight: number; //e.g. trust in the network
    public readonly isMissing: boolean;
    public isValidating: boolean;
    public graphQuorumSet: GraphQuorumSet = new GraphQuorumSet();

    constructor(
        publicKey: PublicKey,
        label: string,
        isValidating: boolean,
        weight: number,
        graphQuorumSet: GraphQuorumSet,
        isMissing: boolean = false
    ) {
        this.label = label;
        this.publicKey = publicKey;
        this.weight = weight;
        this.isValidating = isValidating;
        this.graphQuorumSet = graphQuorumSet;
        this.isMissing = isMissing;
    }

    toString() {
        return `Vertex (publicKey: ${this.publicKey}, label: ${this.label}, isValidating: ${this.isValidating})`;
    }
}

export function isVertex(vertex: Vertex|undefined): vertex is Vertex {
    return vertex instanceof Vertex;
}

export class Edge {
    public readonly parent: Vertex;
    public readonly child: Vertex;

    constructor(parent: Vertex, child: Vertex) {
        this.parent = parent;
        this.child = child;
    }

    get isActive(): boolean {
        return this.child.isValidating && this.parent.isValidating
    }

    toString() {
        return `Edge (parent: ${this.parent.publicKey}, child: ${this.child.publicKey}, isActive: ${this.isActive})`;
    }
}

export class DirectedGraph {
    protected readonly _stronglyConnectedComponentsFinder: StronglyConnectedComponentsFinder;
    protected readonly _transitiveQuorumSetFinder: TransitiveQuorumSetFinder;

    protected _vertices = new Map<PublicKey, Vertex>();
    protected _edges = new Set<Edge>();

    protected _stronglyConnectedComponents: Array<StronglyConnectedComponent> = [];
    protected _stronglyConnectedVertices: Map<PublicKey, number> = new Map<PublicKey, number>();
    protected _transitiveQuorumSet: Set<PublicKey> = new Set<PublicKey>();

    protected children = new Map<PublicKey, Set<Vertex>>();
    protected parents = new Map<PublicKey, Set<Vertex>>();

    constructor(
        stronglyConnectedComponentsFinder: StronglyConnectedComponentsFinder,
        transitiveQuorumSetFinder: TransitiveQuorumSetFinder) {


        this._stronglyConnectedComponentsFinder = stronglyConnectedComponentsFinder;
        this._transitiveQuorumSetFinder = transitiveQuorumSetFinder;
    }

    public build(vertices: Array<Vertex>) {
        vertices.forEach(vertex => this.addVertex(vertex)); //for fast lookup
        this.vertices.forEach(vertex => this.addEdgesFromGraphQuorumSet(vertex, vertex.graphQuorumSet));
    }

    protected addEdgesFromGraphQuorumSet(parent: Vertex, graphQuorumSet: GraphQuorumSet) {
        graphQuorumSet.validators
            .map(validator => this.getVertex(validator))
            .filter(isVertex)
            .forEach(validatorVertex => this.addEdge(new Edge(parent, validatorVertex)));
        graphQuorumSet.innerGraphQuorumSets.forEach( innerGraphQuorumSet => {
            this.addEdgesFromGraphQuorumSet(parent, innerGraphQuorumSet);
        })
    }

    public updateVerticesFailingByQuorumSetNotMeetingThreshold() {
        //no reason to check already failing vertices
        let verticesToCheck: Array<Vertex> =
            Array.from(this.vertices.values()).filter(vertex => vertex.isValidating);

        let inVerticesToCheckQueue: Map<PublicKey, boolean> = new Map();

        verticesToCheck.forEach(vertex => inVerticesToCheckQueue.set(vertex.publicKey, true));

        while (verticesToCheck.length > 0) {
            let vertexToCheck = verticesToCheck.pop()!;
            inVerticesToCheckQueue.set(vertexToCheck.publicKey, false);

            if (!vertexToCheck.isValidating) {
                continue; //already failing
            }

            if (this.graphQuorumSetCanReachThreshold(vertexToCheck.graphQuorumSet)
            ) {
                continue; //working as expected
            }

            //node is failing
            vertexToCheck.isValidating = false;

            Array.from(this.getParents(vertexToCheck))
                .filter(vertex => inVerticesToCheckQueue.get(vertex.publicKey) === false)
                .forEach(vertex => {
                    verticesToCheck.push(vertex);
                    inVerticesToCheckQueue.set(vertex.publicKey, true);
                });
        }
    }

    public graphQuorumSetCanReachThreshold(
        graphQuorumSet: GraphQuorumSet
    ) {
        let counter = graphQuorumSet.validators
            .map(validator => this.getVertex(validator))
            .filter(vertex => vertex !== undefined && vertex.isValidating)
            .length;

        graphQuorumSet.innerGraphQuorumSets.forEach(innerGraphQS => {
            if (this.graphQuorumSetCanReachThreshold(innerGraphQS)) {
                counter++;
            }
        });

        return counter >= graphQuorumSet.threshold;
    }


    public updateStronglyConnectedComponentsAndTransitiveQuorumSet() {
        this._stronglyConnectedComponents = this._stronglyConnectedComponentsFinder.findTarjan(this);
        this._stronglyConnectedVertices = new Map<PublicKey, number>();

        for (let i = 0; i < this._stronglyConnectedComponents.length; i++) {
            this._stronglyConnectedComponents[i]
                .forEach(publicKey => this._stronglyConnectedVertices.set(publicKey, i));
        }

        this._transitiveQuorumSet = this._transitiveQuorumSetFinder.getTransitiveQuorumSet(
            this._stronglyConnectedComponents, this
        );
    }

    public hasTransitiveQuorumSet() {
        return this._transitiveQuorumSet.size > 0;
    }

    get transitiveQuorumSet() {
        return this._transitiveQuorumSet;
    }

    public addVertex(vertex: Vertex) {
        this._vertices.set(vertex.publicKey, vertex);
        this.children.set(vertex.publicKey, new Set<Vertex>());
        this.parents.set(vertex.publicKey, new Set<Vertex>());
    }

    public getInDegree(vertex: Vertex): number {
        if (!this.parents.has(vertex.publicKey)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.parents.get(vertex.publicKey)!.size;
    }

    public getOutDegree(vertex: Vertex): number {
        if (!this.children.has(vertex.publicKey)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.children.get(vertex.publicKey)!.size;
    }

    public isVertexPartOfTransitiveQuorumSet(publicKey: PublicKey) {
        return this._transitiveQuorumSet.has(publicKey);
    }

    public isVertexPartOfStronglyConnectedComponent(publicKey: PublicKey) {
        return this._stronglyConnectedVertices.has(publicKey);
    }

    public isEdgePartOfTransitiveQuorumSet(edge: Edge) {
        return this._transitiveQuorumSet.has(edge.parent.publicKey)
            && this._transitiveQuorumSet.has(edge.child.publicKey);
    }

    public isEdgePartOfStronglyConnectedComponent(edge: Edge) {
        return this._stronglyConnectedVertices.has(edge.parent.publicKey)
            && this._stronglyConnectedVertices.has(edge.child.publicKey)
            && this._stronglyConnectedVertices.get(edge.parent.publicKey)
            === this._stronglyConnectedVertices.get(edge.child.publicKey);
    }

    public hasVertex(publicKey: PublicKey) {
        return this._vertices.has(publicKey);
    }

    public getVertex(publicKey: PublicKey) {
        return this._vertices.get(publicKey);
    }

    public getChildren(vertex: Vertex): Set<Vertex> {
        if (!this.vertices.has(vertex.publicKey)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.children.get(vertex.publicKey)!;
    }

    public getParents(vertex: Vertex): Set<Vertex> {
        if (!this.vertices.has(vertex.publicKey)) {
            throw new Error('Vertex not part of graph: ' + vertex);
        }
        return this.parents.get(vertex.publicKey)!;
    }

    protected addEdge(edge: Edge) {
        if (!this._vertices.has(edge.parent.publicKey)) {
            throw new Error('unknown vertex: ' + edge.parent);
        }
        if (!this._vertices.has(edge.child.publicKey)) {
            throw new Error('unknown vertex: ' + edge.child);
        }

        this._edges.add(edge);
        this.children.get(edge.parent.publicKey)!.add(edge.child);
        this.parents.get(edge.child.publicKey)!.add(edge.parent);
    }

    public get vertices() {
        return this._vertices;
    }

    public get edges() {
        return this._edges;
    }
}
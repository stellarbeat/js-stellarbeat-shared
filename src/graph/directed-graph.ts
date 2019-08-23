import {PublicKey} from "../network";
import {StronglyConnectedComponentsFinder, StronglyConnectedComponent} from "./strongly-connected-components-finder";
import {TransitiveQuorumSetFinder} from "./transitive-quorum-set-finder";

export class Vertex {
    private readonly _publicKey: PublicKey;
    private readonly _label: string;
    private readonly _weight: number; //e.g. trust in the network
    private _isValidating: boolean;

    constructor(publicKey: PublicKey, label: string, isValidating: boolean, weight: number) {
        this._isValidating = isValidating;
        this._label = label;
        this._publicKey = publicKey;
        this._weight = weight;
    }

    get publicKey(): string {
        return this._publicKey;
    }

    get label(): string {
        return this._label;
    }

    get weight(): number {
        return this._weight;
    }

    get isValidating(): boolean {
        return this._isValidating;
    }

    set isValidating(value: boolean) {
        this._isValidating = value;
    }

    toString() {
        return `Vertex (publicKey: ${this.publicKey}, label: ${this.label}, isValidating: ${this.isValidating})`;
    }
}

export class Edge {
    private readonly _parent: Vertex;
    private readonly _child: Vertex;

    constructor(parent: Vertex, child: Vertex) {
        this._parent = parent;
        this._child = child;
    }

    get parent(): Vertex {
        return this._parent;
    }

    get child(): Vertex {
        return this._child;
    }

//invariant: when parent and child are validating, the edge is active
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
    protected _stronglyConnectedVertices: Map<PublicKey, number>;
    protected _transitiveQuorumSet: Set<PublicKey>;

    protected children = new Map<PublicKey, Set<Vertex>>();
    protected parents = new Map<PublicKey, Set<Vertex>>();

    constructor(
        stronglyConnectedComponentsFinder: StronglyConnectedComponentsFinder,
        transitiveQuorumSetFinder: TransitiveQuorumSetFinder) {

        this._stronglyConnectedComponentsFinder = stronglyConnectedComponentsFinder;
        this._transitiveQuorumSetFinder = transitiveQuorumSetFinder;
    }

    public updateStronglyConnectedComponentsAndTransitiveQuorumSet() {
        this._stronglyConnectedComponents = this._stronglyConnectedComponentsFinder.findTarjan(this);
        this._stronglyConnectedVertices = new Map<PublicKey, number>();

        for (let i = 0; i< this._stronglyConnectedComponents.length; i++){
            this._stronglyConnectedComponents[i]
                .forEach(publicKey => this._stronglyConnectedVertices.set(publicKey, i));
        }

        this._transitiveQuorumSet = this._transitiveQuorumSetFinder.determineTransitiveQuorumSet(
            this._stronglyConnectedComponents, this
        );
    }

    hasTransitiveQuorumSet() {
        return this._transitiveQuorumSet !== undefined;
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

    public isVertexPartOfTransitiveQuorumSet(publicKey:PublicKey) {
        return this.hasTransitiveQuorumSet() && this._transitiveQuorumSet.has(publicKey);
    }

    public isVertexPartOfStronglyConnectedComponent(publicKey:PublicKey) {
        return this._stronglyConnectedVertices.has(publicKey);
    }

    public isEdgePartOfTransitiveQuorumSet(edge:Edge) {
        return this.hasTransitiveQuorumSet()
            && this._transitiveQuorumSet.has(edge.parent.publicKey)
            && this._transitiveQuorumSet.has(edge.child.publicKey);
    }

    public isEdgePartOfStronglyConnectedComponent(edge:Edge) {
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

    public addEdge(edge: Edge) {
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
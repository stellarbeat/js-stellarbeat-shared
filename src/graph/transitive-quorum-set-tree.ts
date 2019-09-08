import {PublicKey} from "../network";

export interface TransitiveQuorumSetTreeVertexInterface {
    readonly id: string;
    readonly publicKey: PublicKey;
    readonly label: string;
    readonly isRoot: boolean;
    readonly isValidating: boolean;
    readonly distance: number;
    toString: () => string;
}

export class TransitiveQuorumSetTreeRoot implements TransitiveQuorumSetTreeVertexInterface {
    public readonly id;
    public readonly publicKey: PublicKey;
    public readonly label: string;
    public readonly isRoot: boolean = false;
    public readonly isValidating: boolean;
    public readonly distance: number;

    constructor(publicKey: string, label: string, isValidating: boolean) {
        this.isValidating = isValidating;
        this.publicKey = publicKey;
        this.label = label;
        this.isRoot = true;
        this.distance = 0;
        this.id = this.publicKey;
    }

    toString() {
        return `Transitive Quorum Set Tree Root (publicKey: ${this.publicKey}, label: ${this.label}, isValidating: ${this.isValidating})`;
    }
}

export class TransitiveQuorumSetTreeVertex implements TransitiveQuorumSetTreeVertexInterface {
    public readonly publicKey: PublicKey;
    public readonly label: string;
    public readonly isRoot: boolean = false;
    public readonly isValidating: boolean;
    public readonly distance: number;
    public readonly parent: TransitiveQuorumSetTreeVertexInterface;
    public readonly id: string;

    constructor(publicKey: string, label: string, isValidating: boolean, parent: TransitiveQuorumSetTreeVertexInterface) {
        this.isValidating = isValidating;
        this.publicKey = publicKey;
        this.label = label;
        this.isRoot = false;
        this.distance = parent.distance + 1;
        this.parent = parent;
        this.id = this.parent.publicKey + '_' + this.publicKey;
    }

    toString() {
        return `Transitive Quorum Set Tree Vertex (publicKey: ${this.publicKey}, label: ${this.label}, isRoot: ${this.isRoot},  isValidating: ${this.isValidating}, distance: ${this.distance})`;
    }
}

export class TransitiveQuorumSetTreeEdge {
    public readonly parent: TransitiveQuorumSetTreeVertexInterface;
    public readonly child: TransitiveQuorumSetTreeVertexInterface;

    constructor(parent: TransitiveQuorumSetTreeVertexInterface, child: TransitiveQuorumSetTreeVertexInterface) {
        this.parent = parent;
        this.child = child;
    }

    toString() {
        return `Transitive Quorum Set Tree Edge (parent: ${this.parent.label}, child: ${this.child.label})`;
    }
}

type Parent = TransitiveQuorumSetTreeVertexInterface;
type Child = TransitiveQuorumSetTreeVertexInterface;

export class TransitiveQuorumSetTree {
    protected _vertices: Set<TransitiveQuorumSetTreeVertexInterface> = new Set<TransitiveQuorumSetTreeVertexInterface>();
    protected _edges: Set<TransitiveQuorumSetTreeEdge> = new Set<TransitiveQuorumSetTreeEdge>();
    protected _children: Map<Parent, Child[]> = new Map<Parent, Child[]>();
    public readonly root: TransitiveQuorumSetTreeRoot;

    constructor(root: TransitiveQuorumSetTreeRoot) {
        this._vertices.add(root);
        this.root = root;
    }

    public addVertex(vertex: TransitiveQuorumSetTreeVertex) {
        if (!this._vertices.has(vertex.parent)) {
            throw new Error('Parent vertex not found in tree: ' + vertex.parent);
        }

        this._vertices.add(vertex);
        if (!this._children.has(vertex.parent))
            this._children.set(vertex.parent, []);

        this._children.get(vertex.parent).push(vertex);

        this._edges.add(new TransitiveQuorumSetTreeEdge(vertex.parent, vertex));
    }

    get vertices() {
        return Array.from(this._vertices);
    }

    get edges() {
        return Array.from(this._edges);
    }

    getChildren(transitiveQuorumSetTreeVertex:TransitiveQuorumSetTreeVertexInterface){
        return this._children.get(transitiveQuorumSetTreeVertex);
    }
}
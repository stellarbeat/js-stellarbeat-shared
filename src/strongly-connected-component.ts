type PublicKey = string;

export class StronglyConnectedComponent {
    private _nodes: Set<PublicKey>;
    private _isTransitiveQuorumSet = false; //a strongly connected component that has no outward edges

    constructor() {
        this._nodes = new Set<PublicKey>();
    }

    get nodes(): Set<PublicKey> {
        return this._nodes;
    }

    set nodes(value: Set<PublicKey>) {
        this._nodes = value;
    }

    get isTransitiveQuorumSet(): boolean {
        return this._isTransitiveQuorumSet;
    }

    set isTransitiveQuorumSet(value: boolean) {
        this._isTransitiveQuorumSet = value;
    }
}
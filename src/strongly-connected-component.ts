import {Node} from "./node";

export class StronglyConnectedComponent {
    protected _nodes: Set<Node>;
    protected _isTransitiveQuorumSet; //a strongly connected component that has no outward edges
}
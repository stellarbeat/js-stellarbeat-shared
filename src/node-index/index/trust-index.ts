import {TrustGraph, TrustGraphBuilder, Network, Node} from "./../../index";

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class TrustIndex {

    protected _graph!: TrustGraph;
    protected _nodes:Node[];

    constructor(nodes: Node[]) {
        this._nodes = nodes;
        let manager = new TrustGraphBuilder();
        this._graph = manager.buildGraphFromNodes(nodes);
    }

    get(node: Node): number {
        let vertex = this._graph.getVertex(node.publicKey!);

        if(!vertex)
            return 0;

        return (
                Array.from(this._graph.getParents(vertex))
                .filter((trustingVertex) => trustingVertex.key !== vertex!.key).length
            )
            /
            (
                Array.from(this._graph.vertices.values()).filter(vertex => this._graph.getOutDegree(vertex) > 0).length - 1
            );//exclude the node itself
    }
}
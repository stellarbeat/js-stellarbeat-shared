import {DirectedGraph, DirectedGraphManager, Network, Node} from "./../../index";

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class TrustIndex {

    protected _graph!: DirectedGraph;
    protected _nodes:Node[];

    constructor(nodes: Node[]) {
        this._nodes = nodes;
        let manager = new DirectedGraphManager();
        this._graph = manager.buildGraphFromNodes(nodes);
    }

    get(node: Node): number {
        let vertex = this._graph.getVertex(node.publicKey!);
        if(!vertex)
            return 0;

        return (
                Array.from(this._graph.getParents(vertex))
                .filter((trustingVertex) => trustingVertex.publicKey !== vertex!.publicKey).length
            )
            /
            (
                this._graph.vertices.size - 1
            );//exclude the node itself
    }
}
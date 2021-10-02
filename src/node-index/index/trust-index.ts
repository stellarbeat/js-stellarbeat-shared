import { Network, Node } from './../../index';

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class TrustIndex {
	protected _network: Network;

	constructor(network: Network) {
		this._network = network;
	}

	get(node: Node): number {
		const vertex = this._network.nodesTrustGraph.getVertex(node.publicKey!);

		if (!vertex) return 0;

		if (
			Array.from(this._network.nodesTrustGraph.vertices.values()).filter(
				(vertex) => this._network.nodesTrustGraph.getOutDegree(vertex) > 0
			).length -
				1 ===
			0
		)
			return 0;
		return (
			Array.from(this._network.nodesTrustGraph.getParents(vertex)).filter(
				(trustingVertex) => trustingVertex.key !== vertex!.key
			).length /
			(Array.from(this._network.nodesTrustGraph.vertices.values()).filter(
				(vertex) => this._network.nodesTrustGraph.getOutDegree(vertex) > 0
			).length -
				1)
		); //exclude the node itself
	}
}

import {Network, Node} from "./../../index";

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class TrustIndex {

    _network: Network;

    constructor(network: Network) {
        this._network = network;
    }

    get(node: Node): number {
        return (
            this._network.getTrustingNodes(node)
                .filter((trustingNode) => trustingNode.active && trustingNode !== node).length
            )
            /
            (
                this._network.nodes
                    .filter(networkNode => networkNode.active && networkNode.isValidator).length -1
            );//exclude the node itself
    }
}
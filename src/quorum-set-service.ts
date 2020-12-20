import {QuorumSet} from "./quorum-set";
import {TrustGraph} from "./trust-graph/trust-graph";
import {Network, PublicKey} from "./network";

export class QuorumSetService {
    /*
    //network is only needed to fetch nodes by Id, ideally this should be abstracted in repository
     */
    public static quorumSetCanReachThreshold(quorumSet:QuorumSet, network: Network, blockedNodes: Set<PublicKey>) { //
        let counter = quorumSet.validators
            .map(validator => network.getNodeByPublicKey(validator))
            .filter(validator => validator.isValidating && !blockedNodes.has(validator.publicKey))
            .length;

        quorumSet.innerQuorumSets.forEach(innerQS => {
            if (this.quorumSetCanReachThreshold(innerQS, network, blockedNodes)) {
                counter++;
            }
        });

        return counter >= quorumSet.threshold;
    }

    /**
     * A blocked node is node that cannot reach its quorumset threshold (recursively)
     * @param network
     * @param nodesTrustGraph
     */
    public static getBlockedNodes(network: Network, nodesTrustGraph: TrustGraph) {
        let nodesToCheck = network.nodes.filter(node => node.isValidator);
        let blockedNodes: Set<PublicKey> = new Set();
        let inNodesToCheckQueue: Map<PublicKey, boolean> = new Map();

        nodesToCheck.forEach(node => inNodesToCheckQueue.set(node.publicKey, true));

        while (nodesToCheck.length > 0) {
            let nodeToCheck = nodesToCheck.pop()!;
            inNodesToCheckQueue.set(nodeToCheck.publicKey, false);

            if(blockedNodes.has(nodeToCheck.publicKey) || !nodeToCheck.isValidating){
                continue; //already blocked or not validating, thus no change in situation that could cause other nodes to fail
            }

            if (QuorumSetService.quorumSetCanReachThreshold(nodeToCheck.quorumSet, network, blockedNodes)
            ) {
                continue; //working as expected
            }

            //node is failing
            blockedNodes.add(nodeToCheck.publicKey);

            let vertexToCheck = nodesTrustGraph.getVertex(nodeToCheck.publicKey);
            if(!vertexToCheck)
                continue;//this should not happen;

            Array.from(nodesTrustGraph.getParents(vertexToCheck))
                .filter(vertex => inNodesToCheckQueue.get(vertex.key) === false)
                .forEach(vertex => {
                    let node = network.getNodeByPublicKey(vertex.key);
                    nodesToCheck.push(node);
                    inNodesToCheckQueue.set(node.publicKey, true);
                });
        }

        return blockedNodes;
    }
}
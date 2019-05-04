//A node is part of a cluster if it is connected to itself through the other nodes in the cluster.
import * as _ from "lodash";
import {QuorumSet, Node} from '../src';

export class ClusterService {

    protected _nodes: Node[];
    protected _publicKeysToNodesMap: Map<string, Node>;
    protected _clusterCache: [string[]] = [[]];

    constructor(nodes: Node[], publicKeysToNodesMap?: Map<string, Node>) {
        this.initialize(nodes, publicKeysToNodesMap);
    }

    updateNodes(nodes: Node[], publicKeysToNodesMap?: Map<string, Node>) {
        this.initialize(nodes, publicKeysToNodesMap);
    }

    protected initialize(nodes: Node[], publicKeysToNodesMap?: Map<string, Node>) {
        this._nodes = nodes;
        if (publicKeysToNodesMap === undefined) {
            this._publicKeysToNodesMap = this.getPublicKeyToNodeMap(nodes);
        } else {
            this._publicKeysToNodesMap = publicKeysToNodesMap;
        }
    }

    getAllClusters() {
        let clusters = [];
        this._nodes.forEach(node => {
                let cluster = this.getCluster(node);

                if (cluster.length !==0 && clusters.every(alreadyDetectedCluster => !_.isEqual(alreadyDetectedCluster, new Set(cluster))
                )) {
                    clusters.push(new Set(cluster));
                }
            }
        );

        return clusters;
    }

    getCluster(node: Node) {
        if (!node.quorumSet) {
            return [];
        }

        let cachedClusters = this._clusterCache.filter(cluster => cluster.indexOf(node.publicKey) > -1);
        if (cachedClusters.length > 0)
            return cachedClusters[0];

        let cluster = this.getNodeChainRecursive(node.publicKey)
            .filter(publicKey => this
                .getNodeChainRecursive(publicKey)
                .indexOf(node.publicKey) > -1
            );

        if (cluster.length <= 1) {
            return [];
        }

        this._clusterCache.push(cluster);

        return cluster;
    }

    getNodeChainRecursive(publicKey: string, processedPublicKeys: string[] = []) {
        let node = this._publicKeysToNodesMap.get(publicKey);
        if (!node)
            return processedPublicKeys;

        if (!node.active) { //inactive nodes are not part of the cluster
            return processedPublicKeys;
        }

        if (processedPublicKeys.indexOf(node.publicKey) >= 0) //already part of chain
            return processedPublicKeys;

        processedPublicKeys.push(node.publicKey);

        return QuorumSet.getAllValidators(node.quorumSet)
            .reduce(
                (processedPublicKeys, unProcessedNode) => this.getNodeChainRecursive(unProcessedNode, processedPublicKeys),
                processedPublicKeys
            );
    }

    protected getPublicKeyToNodeMap(nodes): Map<string, Node> {
        return new Map(nodes
            .filter(node => node.publicKey)
            .map(node => [node.publicKey, node])
        );
    }
}
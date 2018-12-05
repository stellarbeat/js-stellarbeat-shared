"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const quorum_set_1 = require("./quorum-set");
const node_1 = require("./node");
const _ = require("lodash");
const quorum_service_1 = require("./quorum-service");
class Network {
    constructor(nodes) {
        this._nodes = nodes;
        this._publicKeyToNodesMap = quorum_service_1.default.getPublicKeyToNodeMap(nodes);
        this.calculateLatestCrawlDate(); //before we create nodes for unknown validators because they will have higher updated dates
        this.createNodesForUnknownValidators();
        this.initializeReverseNodeDependencyMap();
        this.computeFailingNodes();
        this.detectClusters();
        this.createLinks();
    }
    computeQuorumIntersection() {
        quorum_service_1.default.hasQuorumIntersection(this._nodes, this._clusters, this._publicKeyToNodesMap);
    }
    updateNetwork(nodes) {
        if (nodes) {
            this._nodes = nodes;
            this._publicKeyToNodesMap = quorum_service_1.default.getPublicKeyToNodeMap(nodes);
            this.createNodesForUnknownValidators();
        }
        this.initializeReverseNodeDependencyMap();
        this.computeFailingNodes();
        this.createLinks();
    }
    detectClusters() {
        this._clusters = quorum_service_1.default.getAllClusters(this.nodes.filter(node => node.active && node.quorumSet.hasValidators()), this._publicKeyToNodesMap);
        //let clusterLeafs = QuorumService.getAllClusterLeafs(clusters, this._publicKeyToNodesMap);
    }
    calculateLatestCrawlDate() {
        if (this.nodes.length === 0) {
            return undefined;
        }
        this._latestCrawlDate = this.nodes
            .map(node => node.dateUpdated)
            .sort(function (a, b) {
            return b.valueOf() - a.valueOf();
        })[0];
    }
    get latestCrawlDate() {
        return this._latestCrawlDate;
    }
    get links() {
        return this._links;
    }
    get failingNodes() {
        return this._failingNodes;
    }
    isNodeFailing(node) {
        return this._failingNodes.includes(node);
    }
    isQuorumSetFailing(quorumSet) {
        return !this.quorumSetCanReachThreshold(quorumSet, this._failingNodes);
    }
    createLinks() {
        this._links = _.flatten(this._nodes
            .filter(node => node.active && !this._failingNodes.includes(node))
            .map(node => {
            return quorum_set_1.QuorumSet.getAllValidators(node.quorumSet)
                .filter(validator => this._publicKeyToNodesMap.get(validator).active && !this._failingNodes.includes(this._publicKeyToNodesMap.get(validator)))
                .map(validator => {
                return {
                    'id': node.publicKey + validator,
                    'source': node,
                    'target': this._publicKeyToNodesMap.get(validator),
                    'isClusterLink': this.isClusterLink(node.publicKey, validator) /*,
                    'active': this._publicKeyToNodesMap.get(validator).active
                    && this._publicKeyToNodesMap.get(node.publicKey).active
                    && !this._failingNodes.includes(this._publicKeyToNodesMap.get(validator))
                    && !this._failingNodes.includes(node)*/
                };
            });
        }));
    }
    isClusterLink(source, target) {
        return Array.from(this._clusters).filter(cluster => cluster.has(source) && cluster.has(target)).length > 0;
    }
    createNodesForUnknownValidators() {
        this._nodes.forEach(node => {
            quorum_set_1.QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._publicKeyToNodesMap.has(validator)) {
                    let missingNode = new node_1.Node('unknown');
                    missingNode.publicKey = validator;
                    this.nodes.push(missingNode);
                    this._publicKeyToNodesMap.set(validator, missingNode);
                }
            });
        });
    }
    initializeReverseNodeDependencyMap() {
        this._reverseNodeDependencyMap = new Map();
        this.nodes.forEach(node => {
            quorum_set_1.QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._reverseNodeDependencyMap.has(validator)) {
                    this._reverseNodeDependencyMap.set(validator, []);
                }
                this._reverseNodeDependencyMap.get(validator).push(node);
            });
        });
    }
    get nodes() {
        return this._nodes;
    }
    getNodeByPublicKey(publicKey) {
        return this._publicKeyToNodesMap.get(publicKey);
    }
    computeFailingNodes() {
        let failingNodes = [];
        let nodesToCheck = this._nodes.filter(node => node.active && node.quorumSet.hasValidators()); //check all active nodes
        while (nodesToCheck.length > 0) {
            let nodeToCheck = nodesToCheck.pop();
            if (failingNodes.includes(nodeToCheck)) {
                continue; //already failing
            }
            if (this.quorumSetCanReachThreshold(nodeToCheck.quorumSet, failingNodes)) {
                continue; //working as expected
            }
            //node is failing
            failingNodes.push(nodeToCheck);
            //recheck all nodes that are dependant on it
            if (!this._reverseNodeDependencyMap.has(nodeToCheck.publicKey)) {
                continue; //no nodes are dependant on it
            }
            this._reverseNodeDependencyMap.get(nodeToCheck.publicKey).forEach(node => {
                if (node.active && node.quorumSet.hasValidators())
                    nodesToCheck.push(node);
            });
        }
        this._failingNodes = failingNodes;
    }
    quorumSetCanReachThreshold(quorumSet, failingNodes) {
        let counter = quorumSet.validators.filter(validator => {
            if (!this._publicKeyToNodesMap.has(validator)) {
                return false;
            }
            if (failingNodes.includes(this._publicKeyToNodesMap.get(validator))) {
                return false;
            }
            return this._publicKeyToNodesMap.get(validator).active;
        }).length;
        quorumSet.innerQuorumSets.forEach(innerQS => {
            if (this.quorumSetCanReachThreshold(innerQS, failingNodes)) {
                counter++;
            }
        });
        return counter >= quorumSet.threshold;
    }
}
exports.Network = Network;
//# sourceMappingURL=network.js.map
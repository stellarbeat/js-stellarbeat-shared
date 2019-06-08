import {
    QuorumSet,
    Node,
    QuorumService,
    QuorumSetService,
    generateTomlString,
    ClusterService,
    Organization
} from "./index";
import * as _ from 'lodash';

type OrganizationId = string;
type PublicKey = string;

export class Network {
    protected _nodes: Array<Node>;
    protected _organizations: Array<Organization>;
    protected _links: Array<{ id: string, source: Node, target: Node, isClusterLink: boolean }>;
    protected _nodesMap: Map<PublicKey, Node>;
    protected _organizationsMap: Map<OrganizationId, Organization> = new Map();

    protected _failingNodes: Array<Node>;
    protected _reverseNodeDependencyMap: Map<string, Array<Node>>;
    protected _clusters: Array<Set<string>>;
    protected _latestCrawlDate: Date;
    protected _quorumSetService: QuorumSetService;

    constructor(nodes: Array<Node>, organizations: Array<Organization> = []) {
        this._nodes = nodes;
        this._organizations = organizations;
        this._nodesMap = QuorumService.getPublicKeyToNodeMap(nodes);
        this._quorumSetService = new QuorumSetService();
        this.calculateLatestCrawlDate(); //before we create nodes for unknown validators because they will have higher updated dates
        this.createNodesForUnknownValidators();
        this.initializeReverseNodeDependencyMap();
        this.initializeOrganizationsMap();
        this.computeFailingNodes();
        this.detectClusters();
        this.createLinks();
    }

    initializeOrganizationsMap() {
        this._organizations.forEach(organization => this._organizationsMap.set(organization.id, organization));
    }

    computeQuorumIntersection() {
        QuorumService.hasQuorumIntersection(
            this._nodes,
            this._clusters,
            this._nodesMap
        )
    }

    updateNetwork(nodes?: Array<Node>) {
        if (nodes) {
            this._nodes = nodes;
            this._nodesMap = QuorumService.getPublicKeyToNodeMap(nodes);
            this.createNodesForUnknownValidators();
        }
        this.initializeReverseNodeDependencyMap();
        this.computeFailingNodes();
        this.detectClusters();
        this.createLinks();
    }

    detectClusters() {
        let clusterService = new ClusterService(
            this.nodes.filter(node => node.active && node.quorumSet.hasValidators()),
            this._nodesMap
        );
        this._clusters = clusterService.getAllClusters();
    }

    calculateLatestCrawlDate(): Date | undefined {
        if (this.nodes.length === 0) {
            return undefined;
        }

        this._latestCrawlDate = this.nodes
            .map(node => node.dateUpdated)
            .sort(function (a: Date, b: Date) {
                return b.valueOf() - a.valueOf();
            })[0];
    }

    get latestCrawlDate(): Date {
        return this._latestCrawlDate;
    }

    get links() {
        return this._links;
    }

    get failingNodes() {
        return this._failingNodes;
    }

    isNodeFailing(node: Node) {
        return this._failingNodes.includes(node);
    }

    isQuorumSetFailing(node: Node, innerQuorumSet?:QuorumSet) {
        let quorumSet = innerQuorumSet;
        if(quorumSet === undefined) {
            quorumSet = node.quorumSet;
        }
        return !this._quorumSetService.quorumSetCanReachThreshold(node, quorumSet, this._failingNodes, this._nodesMap);
    }

    getQuorumSetTomlConfig(quorumSet: QuorumSet): string {
        return generateTomlString(quorumSet, this._nodesMap);
    }

    createLinks() {
        this._links = _.flatten(this._nodes
            .filter(node => node.active && !this._failingNodes.includes(node))
            .map(node => {
                return QuorumSet.getAllValidators(node.quorumSet)
                    .filter(validator => this._nodesMap.get(validator).active && !this._failingNodes.includes(this._nodesMap.get(validator)))
                    .map(validator => {
                        return {
                            'id': node.publicKey + validator,
                            'source': node,
                            'target': this._nodesMap.get(validator),
                            'isClusterLink': this.isClusterLink(node.publicKey, validator)/*,
                    'active': this._nodesMap.get(validator).active
                    && this._nodesMap.get(node.publicKey).active
                    && !this._failingNodes.includes(this._nodesMap.get(validator))
                    && !this._failingNodes.includes(node)*/
                        };
                    })
            }));
    }

    isClusterLink(source, target) {
        return Array.from(this._clusters).filter(cluster => cluster.has(source) && cluster.has(target)).length > 0;
    }

    createNodesForUnknownValidators() {
        this._nodes.forEach(node => {
            QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._nodesMap.has(validator)) {
                    let missingNode = new Node('unknown');
                    missingNode.publicKey = validator;
                    this.nodes.push(missingNode);
                    this._nodesMap.set(validator, missingNode);
                }
            })
        });
    }

    initializeReverseNodeDependencyMap() {
        this._reverseNodeDependencyMap = new Map();
        this.nodes.forEach(node => {
            QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._reverseNodeDependencyMap.has(validator)) {
                    this._reverseNodeDependencyMap.set(validator, [])
                }
                this._reverseNodeDependencyMap.get(validator).push(node);
            })
        });
    }

    get nodes(): Array<Node> {
        return this._nodes;
    }

    getNodeByPublicKey(publicKey) {
        return this._nodesMap.get(publicKey)
    }

    getOrganizationById(id:OrganizationId) {
        return this._organizationsMap.get(id);
    }

    /*
    * Get nodes that have the given node in their quorumSet
     */
    getTrustingNodes(node: Node): Node[] {
        let trustingNodes = this._reverseNodeDependencyMap.get(node.publicKey);
        if(trustingNodes === undefined)
            return [];

        return trustingNodes;
    }

    computeFailingNodes() {
        let failingNodes = [];
        let nodesToCheck = this._nodes.filter(node => node.active && node.quorumSet.hasValidators()); //check all active nodes
        while (nodesToCheck.length > 0) {
            let nodeToCheck = nodesToCheck.pop();

            if (failingNodes.includes(nodeToCheck)) {
                continue; //already failing
            }

            if (nodeToCheck.isValidating && this._quorumSetService.quorumSetCanReachThreshold(nodeToCheck, nodeToCheck.quorumSet, failingNodes, this._nodesMap)) {
                continue; //working as expected
            }

            //node is failing
            failingNodes.push(nodeToCheck);

            //recheck all nodes that are dependant on it
            if (!this._reverseNodeDependencyMap.has(nodeToCheck.publicKey)) {
                continue //no nodes are dependant on it
            }

            this._reverseNodeDependencyMap.get(nodeToCheck.publicKey).forEach(node => {
                if (node.active && node.quorumSet.hasValidators())
                    nodesToCheck.push(node);
            })
        }

        this._failingNodes = failingNodes;
    }
}
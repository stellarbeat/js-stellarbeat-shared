import {
    QuorumSet,
    Node,
    QuorumService,
    QuorumSetService,
    generateTomlString,
    Organization,
    DirectedGraphManager, DirectedGraph
} from "./index";

export type OrganizationId = string;
export type PublicKey = string;

export class Network {
    protected _nodes: Array<Node>;
    protected _organizations: Array<Organization>;
    protected _nodesMap: Map<PublicKey, Node>;
    protected _organizationsMap: Map<OrganizationId, Organization> = new Map();
    protected _graphManager: DirectedGraphManager = new DirectedGraphManager();
    protected _graph: DirectedGraph;
    protected _latestCrawlDate: Date;
    protected _quorumSetService: QuorumSetService;

    constructor(nodes: Array<Node>, organizations: Array<Organization> = []) {
        this._nodes = nodes;
        this._organizations = organizations;
        this._nodesMap = QuorumService.getPublicKeyToNodeMap(nodes);
        this._quorumSetService = new QuorumSetService();
        this.calculateLatestCrawlDate(); //before we create nodes for unknown validators because they will have higher updated dates @todo: fetch from db
        this.createNodesForUnknownValidators();
        this.initializeDirectedGraph();
        this.initializeOrganizationsMap();
    }

    initializeDirectedGraph(){
        this._graph = this._graphManager.buildGraphFromNodes(this._nodes);
    }

    initializeOrganizationsMap() {
        this._organizations.forEach(organization => this._organizationsMap.set(organization.id, organization));
    }

    updateNetwork(nodes?: Array<Node>) {
        if (nodes) {
            this._nodes = nodes;
            this._nodesMap = QuorumService.getPublicKeyToNodeMap(nodes);
            this.createNodesForUnknownValidators();
        }
        this.createNodesForUnknownValidators();
        this.initializeDirectedGraph();
        this.initializeOrganizationsMap();
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

    isNodeFailing(node: Node) {
        let vertex = this._graph.getVertex(node.publicKey);
        if(!vertex) {
            return true;
        }

        return !vertex.isValidating;
    }

    isQuorumSetFailing(node: Node, innerQuorumSet?:QuorumSet) {
        let quorumSet = innerQuorumSet;
        if(quorumSet === undefined) {
            quorumSet = node.quorumSet;
        }
        return !this._graphManager.quorumSetCanReachThreshold(this._graph, quorumSet);
    }

    getQuorumSetTomlConfig(quorumSet: QuorumSet): string {
        return generateTomlString(quorumSet, this._nodesMap);
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

    get nodes(): Array<Node> {
        return this._nodes;
    }

    getNodeByPublicKey(publicKey) {
        return this._nodesMap.get(publicKey)
    }

    get organizations(): Array<Organization> {
        return this._organizations;
    }

    getOrganizationById(id:OrganizationId) {
        return this._organizationsMap.get(id);
    }

    get graph(){
        return this._graph;
    }

    /*
    * Get nodes that have the given node in their quorumSet
     */
    getTrustingNodes(node: Node): Node[] {
        let vertex = this._graph.getVertex(node.publicKey);
        if(!vertex) {
            return [];
        }

        return Array.from(this._graph.getParents(vertex))
            .map(vertex => this.getNodeByPublicKey(vertex.publicKey))
    }
}
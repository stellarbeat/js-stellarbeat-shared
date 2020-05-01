import {
    QuorumSet,
    Node,
    QuorumSetService,
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
    protected _graph!: DirectedGraph;
    protected _crawlDate: Date;
    protected _quorumSetService: QuorumSetService;

    constructor(nodes: Array<Node>, organizations: Array<Organization> = [], crawlDate: Date = new Date()) {
        this._nodes = nodes;
        this._organizations = organizations;
        this._nodesMap = this.getPublicKeyToNodeMap(nodes);
        this.initializeOrganizationsMap();
        this._quorumSetService = new QuorumSetService();
        this._crawlDate = crawlDate;
        this.createNodesForUnknownValidators();
        this.initializeDirectedGraph();
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
        }
        this._nodesMap = this.getPublicKeyToNodeMap(this._nodes);
        this.createNodesForUnknownValidators();
        this.initializeDirectedGraph();
        this.initializeOrganizationsMap();
    }

    get crawlDate(): Date {
        return this._crawlDate;
    }

    isNodeFailing(node: Node) {
        if(!node.isValidator)
            return !node.active;

        let vertex = this._graph.getVertex(node.publicKey!);
        if(!vertex) {
            return true;
        }

        return !vertex.isValidating;
    }

    isQuorumSetFailing(node: Node, innerQuorumSet?:QuorumSet) {//todo should pass graphQuorumSet
        let quorumSet = innerQuorumSet;
        if(quorumSet === undefined) {
            quorumSet = node.quorumSet;
        }
        return !this._graph.graphQuorumSetCanReachThreshold(this._graphManager.mapQuorumSet(quorumSet));
    }

    getQuorumSetTomlConfig(quorumSet: QuorumSet): string {
        return '';//generateTomlString(quorumSet, this._nodesMap);
    }

    createNodesForUnknownValidators() {
        this._nodes.forEach(node => {
            QuorumSet.getAllValidators(node.quorumSet).forEach(validator => {
                if (!this._nodesMap.has(validator)) {
                    let missingNode = new Node('unknown');
                    missingNode.publicKey = validator;
                    missingNode.isValidator = true;
                    this.nodes.push(missingNode);
                    this._nodesMap.set(validator, missingNode);
                }
            })
        });
    }

    get nodes(): Array<Node> {
        return this._nodes;
    }

    getNodeByPublicKey(publicKey: PublicKey) {
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
        let vertex = this._graph.getVertex(node.publicKey!);
        if(!vertex) {
            return [];
        }

        return Array.from(this._graph.getParents(vertex))
            .map(vertex => this.getNodeByPublicKey(vertex.publicKey)!)
    }

    protected getPublicKeyToNodeMap(nodes:Node[]):Map<string, Node> {
        return new Map(nodes
            .filter(node => node.publicKey!)
            .map(node => [node.publicKey!, node])
        );
    }
}
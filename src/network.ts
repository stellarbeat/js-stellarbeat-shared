import {
    QuorumSet,
    Node,
    QuorumSetService,
    Organization,
    DirectedGraphManager, DirectedGraph
} from "./index";
import FbasAnalysisResult from "./fbas-analysis-result";

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
    protected _fbasAnalysisResult?: FbasAnalysisResult;

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

    get fbasAnalysisResult(){
        if(!this._fbasAnalysisResult)
            throw new Error('Fbas Analysis result not populated');

        return this._fbasAnalysisResult;
    }

    set fbasAnalysisResult(fbasAnalysisResult: FbasAnalysisResult){
        this._fbasAnalysisResult = fbasAnalysisResult;
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

    isOrganizationFailing(organization: Organization) {
        let nrOfValidatingNodes = organization.validators
            .map(validator => this.getNodeByPublicKey(validator)!)
            .filter(validator => validator !== undefined)
            .filter(node => !this.isNodeFailing(node)).length;

        return nrOfValidatingNodes - organization.subQuorumThreshold < 0;
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
        let createValidatorIfUnknown = (validator:PublicKey) => {
            if (!this._nodesMap.has(validator)) {
                let missingNode = new Node('unknown', 11625, validator);
                missingNode.isValidator = true;
                this.nodes.push(missingNode);
                this._nodesMap.set(validator, missingNode);
            }
        }
        this._organizations.forEach(organization => {
           organization.validators.forEach(validator => createValidatorIfUnknown(validator))
        });
        this._nodes.forEach(node => {
            QuorumSet.getAllValidators(node.quorumSet).forEach(validator => createValidatorIfUnknown(validator))
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

    get nrOfActiveWatchers() {
        return this.nodes.filter(node => !node.isValidator && node.active).length;
    }

    get nrOfActiveValidators() {
        return this.nodes.filter(node => node.active && node.isValidating && !this.isNodeFailing(node)).length;
    }

    get nrOfActiveFullValidators() {
       return this.nodes.filter(node => node.isFullValidator && !this.isNodeFailing(node)).length;
    }

    get nrOfActiveOrganizations() {
        return this.organizations.filter(organization => !this.isOrganizationFailing(organization)).length;
    }

    protected getPublicKeyToNodeMap(nodes:Node[]):Map<string, Node> {
        return new Map(nodes
            .filter(node => node.publicKey!)
            .map(node => [node.publicKey!, node])
        );
    }

    static fromJSON(network:string|Object):Network {
        let networkObject: any;
        if (typeof network === 'string') {
            networkObject = JSON.parse(network);
        } else
            networkObject = network;

        let nodes = networkObject.nodes
            .map((node: any) => Node.fromJSON(node));

        let organizations = networkObject.organizations
            .map((organization: any) => Organization.fromJSON(organization));

        let fbasAnalysisResult = FbasAnalysisResult.fromJSON(networkObject.fbasAnalysisResult)

        let newNetwork = new Network(nodes, organizations, new Date(networkObject.time));
        newNetwork.fbasAnalysisResult = fbasAnalysisResult;

        return newNetwork
    }

    toJSON():Object {
        return {
            time: this._crawlDate,
            topTier: Array.from(this.graph.networkTransitiveQuorumSet),
            scp: this.graph.stronglyConnectedComponents
                .filter(scp => scp.size > 1)
                .map(scp => Array.from(scp)),
            nodes: this.nodes,
            organizations: this.organizations,
            fbasAnalysisResult: this.fbasAnalysisResult
        }
    }
}
import {
    QuorumSet,
    Node,
    QuorumSetService,
    Organization,
    DirectedGraphManager, DirectedGraph
} from "./index";
import NetworkStatistics from "./network-statistics";

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
    protected _networkStatistics: NetworkStatistics;

    constructor(nodes: Array<Node>, organizations: Array<Organization> = [], crawlDate: Date = new Date(), networkStatistics?:NetworkStatistics) {
        this._nodes = nodes;
        this._organizations = organizations;
        this._nodesMap = this.getPublicKeyToNodeMap(nodes);
        this.initializeOrganizationsMap();
        this._quorumSetService = new QuorumSetService();
        this._crawlDate = crawlDate;
        this.createNodesForUnknownValidators();
        this.initializeDirectedGraph();
        if(networkStatistics)
            this._networkStatistics = networkStatistics;
        else {
            this._networkStatistics = new NetworkStatistics();
            this.updateNetworkStatistics();
        }
    }

    get networkStatistics(){
        return this._networkStatistics;
    }
    updateNetworkStatistics(fbasAnalysisResult?:any){
        this.networkStatistics.nrOfActiveWatchers = this.nodes.filter(node => !node.isValidator && node.active).length;
        this.networkStatistics.nrOfActiveValidators = this.nodes.filter(node => node.active && node.isValidating && !this.isNodeFailing(node)).length;
        this.networkStatistics.nrOfActiveFullValidators = this.nodes.filter(node => node.isFullValidator && !this.isNodeFailing(node)).length;
        this.networkStatistics.nrOfActiveOrganizations = this.organizations.filter(organization => !this.isOrganizationFailing(organization)).length;
        this.networkStatistics.transitiveQuorumSetSize = this.graph.networkTransitiveQuorumSet.size;

        if(fbasAnalysisResult){
            //todo: integrate fbas analyzer wasm implementation
        }
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
        this.updateNetworkStatistics();
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

        let networkStatistics = NetworkStatistics.fromJSON(networkObject.statistics)

        let newNetwork = new Network(nodes, organizations, new Date(networkObject.time), networkStatistics);

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
            statistics: this.networkStatistics
        }
    }
}
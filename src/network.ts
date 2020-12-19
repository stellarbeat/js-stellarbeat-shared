import {Node, Organization, QuorumSet, QuorumSetService, TrustGraph, TrustGraphBuilder} from "./index";
import NetworkStatistics from "./network-statistics";

export type OrganizationId = string;
export type PublicKey = string;

export class Network {
    protected _nodes: Array<Node>;
    protected _organizations: Array<Organization>;
    protected _trustGraphBuilder: TrustGraphBuilder;
    protected _nodesTrustGraph!: TrustGraph;
    protected _crawlDate: Date;
    protected _quorumSetService: QuorumSetService;
    protected _networkStatistics: NetworkStatistics;

    //a blocked node is a node that cannot reach its threshold.
    //todo: this could become a property of a node, but seeing as the network is the aggregate that controls this property, we keep it here for now.
    public blockedNodes: Set<PublicKey> = new Set();

    //todo should be abstracted to a database
    protected nodesMap: Map<PublicKey, Node>;
    protected organizationsMap: Map<OrganizationId, Organization> = new Map();

    constructor(nodes: Array<Node>, organizations: Array<Organization> = [], crawlDate: Date = new Date(), networkStatistics?: NetworkStatistics) {
        this._nodes = nodes;
        this._organizations = organizations;
        this.nodesMap = this.getPublicKeyToNodeMap(nodes);
        this.initializeOrganizationsMap();
        this._quorumSetService = new QuorumSetService();
        this._crawlDate = crawlDate;
        this._trustGraphBuilder = new TrustGraphBuilder(this);
        this.initializeNodesTrustGraph();

        if (networkStatistics)
            this._networkStatistics = networkStatistics;
        else {
            this._networkStatistics = new NetworkStatistics();
            this.updateNetworkStatistics();
        }

    }

    get networkStatistics() {
        return this._networkStatistics;
    }

    updateNetworkStatistics(fbasAnalysisResult?: any) {
        this.networkStatistics.nrOfActiveWatchers = this.nodes.filter(node => !node.isValidator && node.active).length;
        this.networkStatistics.nrOfActiveValidators = this.nodes.filter(node => node.active && node.isValidating && !this.isNodeFailing(node)).length;
        this.networkStatistics.nrOfActiveFullValidators = this.nodes.filter(node => node.isFullValidator && !this.isNodeFailing(node)).length;
        this.networkStatistics.nrOfActiveOrganizations = this.organizations.filter(organization => organization.subQuorumAvailable).length;
        this.networkStatistics.transitiveQuorumSetSize = this.nodesTrustGraph.networkTransitiveQuorumSet.size;
        this.networkStatistics.hasTransitiveQuorumSet = this.nodesTrustGraph.hasNetworkTransitiveQuorumSet();

        if (fbasAnalysisResult) {
            //todo: integrate fbas analyzer wasm implementation
        }
    }

    initializeNodesTrustGraph() {
        this._nodesTrustGraph = this._trustGraphBuilder.buildGraphFromNodes(false);
    }

    initializeOrganizationsMap() {
        this._organizations.forEach(organization => this.organizationsMap.set(organization.id, organization));
    }

    modifyNetwork(nodes?: Array<Node>) {
        if (nodes) {
            this._nodes = nodes;
        }
        this.nodesMap = this.getPublicKeyToNodeMap(this._nodes);
        this.initializeNodesTrustGraph();
        this.initializeOrganizationsMap();

        //determine if nodes and organizations are failing due to the changes
        this.blockedNodes = QuorumSetService.getBlockedNodes(this, this.nodesTrustGraph);
        this.updateOrganizationSubQuorumAvailabilityStates();

        this.updateNetworkStatistics();
    }

    get crawlDate(): Date {
        return this._crawlDate;
    }

    isNodeFailing(node: Node) {
        if (!node.isValidator)
            return !node.active;

        if(this.blockedNodes.has(node.publicKey))
            return true;

        return !node.isValidating
    }

    isValidatorBlocked(validator: Node){
        return this.blockedNodes.has(validator.publicKey);
    }

    updateOrganizationSubQuorumAvailabilityStates(){
        this.organizations.forEach(organization => {
            let nrOfValidatingNodes = organization.validators
                .map(validator => this.getNodeByPublicKey(validator))
                .filter(validator => !this.isNodeFailing(validator)).length;

            if(nrOfValidatingNodes - organization.subQuorumThreshold < 0)
                organization.subQuorumAvailable = false;
            else organization.subQuorumAvailable = true;
        })
    }

    isQuorumSetFailing(node: Node, innerQuorumSet?: QuorumSet) {//todo should pass graphQuorumSet
        let quorumSet = innerQuorumSet;
        if (quorumSet === undefined) {
            quorumSet = node.quorumSet;
        }

        return !QuorumSetService.quorumSetCanReachThreshold(quorumSet, this, this.blockedNodes);
    }

    get nodes(): Array<Node> {
        return this._nodes;
    }

    getNodeByPublicKey(publicKey: PublicKey): Node {
        if (this.nodesMap.has(publicKey))
            return this.nodesMap.get(publicKey)!;
        else {
            let unknownNode = new Node(publicKey);
            unknownNode.unknown = true;

            return unknownNode;
        }
    }

    get organizations(): Array<Organization> {
        return this._organizations;
    }

    getOrganizationById(id: OrganizationId): Organization {
        if(this.organizationsMap.has(id))
            return this.organizationsMap.get(id)!;
        else {
            let unknownOrganization = new Organization(id, id);
            unknownOrganization.unknown = true;

            return unknownOrganization;
        }
    }

    get nodesTrustGraph() {
        return this._nodesTrustGraph;
    }

    /*
    * Get nodes that have the given node in their quorumSet
     */
    getTrustingNodes(node: Node): Node[] {
        let vertex = this._nodesTrustGraph.getVertex(node.publicKey!);
        if (!vertex) {
            return [];
        }

        return Array.from(this._nodesTrustGraph.getParents(vertex))
            .map(vertex => this.getNodeByPublicKey(vertex.key)!)
    }

    //todo => get data from organizationTrustGraph
    getTrustedOrganizations(quorumSet:QuorumSet):Organization[] {
        let trustedOrganizations:Organization[] = [];
        quorumSet.innerQuorumSets.forEach(innerQSet => {
            if (innerQSet.validators.length === 0) {
                return;
            }
            let organizationId = this.getNodeByPublicKey(innerQSet.validators[0])!.organizationId;
            if ( organizationId === undefined || this.getOrganizationById(organizationId) === undefined) {
                return;
            }

            if(!innerQSet.validators
                .map(validator => this.getNodeByPublicKey(validator)!)
                .every((validator, index, validators) => validator.organizationId === validators[0].organizationId)
            ){
                return;
            }

            trustedOrganizations.push(this.getOrganizationById(organizationId)!);
            trustedOrganizations.push(...this.getTrustedOrganizations(innerQSet));
        })

        return trustedOrganizations;
    }

    protected getPublicKeyToNodeMap(nodes: Node[]): Map<string, Node> {
        return new Map(nodes
            .filter(node => node.publicKey!)
            .map(node => [node.publicKey!, node])
        );
    }

    getTrustedOrganizationsByOrganization(organization: Organization) {
        let trustedOrganizations:Organization[] = [];
        organization.validators.forEach(publicKey => {
            let validator = this.getNodeByPublicKey(publicKey)!;
            this.getTrustedOrganizations(validator.quorumSet).forEach(org => {
                if(org.id !== organization.id)
                    trustedOrganizations.push(org)
            });
        })
        return Array.from(new Set(trustedOrganizations));//remove doubles
    }

    static fromJSON(networkJSON: string | Object): Network {
        let networkDTO: any;
        if (typeof networkJSON === 'string') {
            networkDTO = JSON.parse(networkJSON);
        } else
            networkDTO = networkJSON;

        let nodes = networkDTO.nodes
            .map((node: any) => Node.fromJSON(node));

        let organizations = networkDTO.organizations
            .map((organization: any) => Organization.fromJSON(organization));

        let networkStatistics = NetworkStatistics.fromJSON(networkDTO.statistics);

        return new Network(nodes, organizations, new Date(networkDTO.time), networkStatistics);
    }

    toJSON(): Object {
        return {
            time: this._crawlDate,
            transitiveQuorumSet: Array.from(this.nodesTrustGraph.networkTransitiveQuorumSet),
            scc: this.nodesTrustGraph.stronglyConnectedComponents
                .filter(scp => scp.size > 1)
                .map(scp => Array.from(scp)),
            nodes: this.nodes,
            organizations: this.organizations,
            statistics: this.networkStatistics
        }
    }
}
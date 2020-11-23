import {
    QuorumSet,
    Node,
    QuorumSetService,
    Organization,
    TrustGraphBuilder, TrustGraph
} from "./index";
import NetworkStatistics from "./network-statistics";
import NetworkHydrator from "./network-hydrator";

export type OrganizationId = string;
export type PublicKey = string;

export class Network {
    protected _nodes: Array<Node>;
    protected _organizations: Array<Organization>;
    protected _nodesMap: Map<PublicKey, Node>;
    protected _organizationsMap: Map<OrganizationId, Organization> = new Map();
    protected _trustGraphBuilder: TrustGraphBuilder = new TrustGraphBuilder();
    protected _nodesTrustGraph!: TrustGraph;
    protected _crawlDate: Date;
    protected _quorumSetService: QuorumSetService;
    protected _networkStatistics: NetworkStatistics;

    constructor(nodes: Array<Node>, organizations: Array<Organization> = [], crawlDate: Date = new Date(), networkStatistics?: NetworkStatistics) {
        this._nodes = nodes;
        this._organizations = organizations;
        this._nodesMap = this.getPublicKeyToNodeMap(nodes);
        this.initializeOrganizationsMap();
        this._quorumSetService = new QuorumSetService();
        this._crawlDate = crawlDate;
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
        this.networkStatistics.nrOfActiveOrganizations = this.organizations.filter(organization => !this.isOrganizationFailing(organization)).length;
        this.networkStatistics.transitiveQuorumSetSize = this.nodesTrustGraph.networkTransitiveQuorumSet.size;
        this.networkStatistics.hasTransitiveQuorumSet = this.nodesTrustGraph.hasNetworkTransitiveQuorumSet();

        if (fbasAnalysisResult) {
            //todo: integrate fbas analyzer wasm implementation
        }
    }

    initializeNodesTrustGraph() {
        this._nodesTrustGraph = this._trustGraphBuilder.buildGraphFromNodes(this.nodes, false);
    }

    initializeOrganizationsMap() {
        this._organizations.forEach(organization => this._organizationsMap.set(organization.id, organization));
    }

    updateNetwork(nodes?: Array<Node>) {
        if (nodes) {
            this._nodes = nodes;
        }
        this._nodesMap = this.getPublicKeyToNodeMap(this._nodes);
        this.initializeNodesTrustGraph();
        this.initializeOrganizationsMap();
        this.updateNetworkStatistics();
    }

    get crawlDate(): Date {
        return this._crawlDate;
    }

    isNodeFailing(node: Node) {
        if (!node.isValidator)
            return !node.active;

        let vertex = this._nodesTrustGraph.getVertex(node.publicKey!);
        if (!vertex) {
            return true;
        }

        return vertex.failing;
    }

    isOrganizationFailing(organization: Organization) {
        let nrOfValidatingNodes = organization.validators
            .filter(node => !this.isNodeFailing(node)).length;

        return nrOfValidatingNodes - organization.subQuorumThreshold < 0;
    }

    isQuorumSetFailing(node: Node, innerQuorumSet?: QuorumSet) {//todo should pass graphQuorumSet
        let quorumSet = innerQuorumSet;
        if (quorumSet === undefined) {
            quorumSet = node.quorumSet;
        }

        return !QuorumSetService.quorumSetCanReachThreshold(quorumSet, this._nodesTrustGraph);
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

    getOrganizationById(id: OrganizationId) {
        return this._organizationsMap.get(id);
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

    getTrustedOrganizations(quorumSet:QuorumSet):Organization[] {
        let trustedOrganizations:Organization[] = [];
        quorumSet.innerQuorumSets.forEach(innerQSet => {
            if (innerQSet.validators.length === 0) {
                return;
            }

            let organization = innerQSet.validators[0].organization;
            if (!organization) {
                return;
            }

            if(!innerQSet.validators
                .every((validator, index, validators) => validator.organization && validators[0].organization && validator.organization.id === validators[0].organization.id)
            ){
                return;
            }

            trustedOrganizations.push(organization);
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

    static fromJSON(network: string | Object): Network {
        return NetworkHydrator.hydrateNetwork(network);
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
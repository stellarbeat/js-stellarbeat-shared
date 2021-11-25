import {
	Node,
	Organization,
	QuorumSet,
	QuorumSetService,
	TrustGraph,
	TrustGraphBuilder
} from './index';
import NetworkStatistics from './network-statistics';
import { isObject, isString } from './typeguards';

export type OrganizationId = string;
export type PublicKey = string;

export class Network {
	protected _trustGraphBuilder: TrustGraphBuilder;
	protected _nodesTrustGraph!: TrustGraph;
	//todo: move organization trust graph to network and only calculate when requested
	protected _quorumSetService: QuorumSetService;
	protected _networkStatistics: NetworkStatistics;

	public name?: string;
	public id?: string;

	//a blocked node is a node that cannot reach its threshold.
	//todo: this could become a property of a node, but seeing as the network is the aggregate that controls this property, we keep it here for now.
	public blockedNodes: Set<PublicKey> = new Set();

	protected nodesMap: Map<PublicKey, Node>;
	protected organizationsMap: Map<OrganizationId, Organization> = new Map();

	constructor(
		public nodes: Array<Node> = [],
		public organizations: Array<Organization> = [],
		public time: Date = new Date(),
		public latestLedger: string | null = null,
		networkStatistics?: NetworkStatistics
	) {
		this.latestLedger = latestLedger;
		this.nodes = nodes;
		this.organizations = organizations;
		this.time = time;

		this.nodesMap = this.getPublicKeyToNodeMap(nodes);
		this.initializeOrganizationsMap();
		this._quorumSetService = new QuorumSetService();
		this._trustGraphBuilder = new TrustGraphBuilder(this);
		this.initializeNodesTrustGraph();
		//this.blockedNodes = QuorumSetService.getBlockedNodes(this, this.nodesTrustGraph);

		if (networkStatistics) this._networkStatistics = networkStatistics;
		else {
			this._networkStatistics = new NetworkStatistics();
			this.updateNetworkStatistics();
		}
	}

	get networkStatistics() {
		return this._networkStatistics;
	}

	updateNetworkStatistics(fbasAnalysisResult?: unknown) {
		this.networkStatistics.nrOfActiveWatchers = this.nodes.filter(
			(node) => !node.isValidator && node.active
		).length;
		this.networkStatistics.nrOfActiveValidators = this.nodes.filter(
			(node) => node.active && node.isValidating && !this.isNodeFailing(node)
		).length;
		this.networkStatistics.nrOfActiveFullValidators = this.nodes.filter(
			(node) => node.isFullValidator && !this.isNodeFailing(node)
		).length;
		this.networkStatistics.nrOfActiveOrganizations = this.organizations.filter(
			(organization) => organization.subQuorumAvailable
		).length;
		this.networkStatistics.transitiveQuorumSetSize =
			this.nodesTrustGraph.networkTransitiveQuorumSet.size;
		this.networkStatistics.hasTransitiveQuorumSet =
			this.nodesTrustGraph.hasNetworkTransitiveQuorumSet();

		if (fbasAnalysisResult) {
			//todo: integrate fbas analyzer wasm implementation
		}
	}

	initializeNodesTrustGraph() {
		this._nodesTrustGraph = this._trustGraphBuilder.buildGraphFromNodes(false);
	}

	initializeOrganizationsMap() {
		this.organizations.forEach((organization) =>
			this.organizationsMap.set(organization.id, organization)
		);
	}

	//call this method when the network was changed externally
	recalculateNetwork() {
		this.nodesMap = this.getPublicKeyToNodeMap(this.nodes);
		this.initializeNodesTrustGraph();
		this.initializeOrganizationsMap();

		//determine if nodes and organizations are blocked due to the changes
		this.blockedNodes = QuorumSetService.getBlockedNodes(
			this,
			this.nodesTrustGraph
		);
		this.updateOrganizationSubQuorumAvailabilityStates();

		this.updateNetworkStatistics();
	}

	/*
    An organization is missing if a simple majority of it's validators are missing.
     */
	isOrganizationMissing(organization: Organization) {
		return !organization.subQuorumAvailable;
	}

	/*
    An organization is failing if it is blocked or missing.
     */
	isOrganizationFailing(organization: Organization) {
		if (this.isOrganizationBlocked(organization)) return true;

		return this.isOrganizationMissing(organization);
	}

	/*
      An organization is blocked if due to simulation changes of the network, there aren't enough 'non-blocked' nodes to possibly re-enable it.
     */
	isOrganizationBlocked(organization: Organization) {
		if (organization.subQuorumAvailable) return false;

		return (
			organization.validators.filter(
				(validator) => !this.blockedNodes.has(validator)
			).length < organization.subQuorumThreshold
		);
	}

	updateOrganizationSubQuorumAvailabilityStates() {
		this.organizations.forEach((organization) => {
			const nrOfValidatingNodes = organization.validators
				.map((validator) => this.getNodeByPublicKey(validator))
				.filter((validator) => !this.isNodeFailing(validator)).length;

			if (nrOfValidatingNodes - organization.subQuorumThreshold < 0)
				organization.subQuorumAvailable = false;
			else organization.subQuorumAvailable = true;
		});
	}

	isQuorumSetBlocked(node: Node, innerQuorumSet?: QuorumSet) {
		//todo should pass graphQuorumSet
		let quorumSet = innerQuorumSet;
		if (quorumSet === undefined) {
			quorumSet = node.quorumSet;
		}

		return !QuorumSetService.quorumSetCanReachThreshold(
			quorumSet,
			this,
			this.blockedNodes
		);
	}

	getNodeByPublicKey(publicKey: PublicKey): Node {
		if (this.nodesMap.has(publicKey))
			return this.nodesMap.get(publicKey) as Node;
		else {
			const unknownNode = new Node(publicKey);
			unknownNode.unknown = true;

			return unknownNode;
		}
	}

	getOrganizationById(id: OrganizationId): Organization {
		if (this.organizationsMap.has(id))
			return this.organizationsMap.get(id) as Organization;
		else {
			const unknownOrganization = new Organization(id, id);
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
		const vertex = this._nodesTrustGraph.getVertex(node.publicKey);
		if (!vertex) {
			return [];
		}

		return Array.from(this._nodesTrustGraph.getParents(vertex)).map((vertex) =>
			this.getNodeByPublicKey(vertex.key)
		);
	}

	//todo => get data from organizationTrustGraph
	getTrustedOrganizations(quorumSet: QuorumSet): Organization[] {
		const trustedOrganizations: Organization[] = [];
		quorumSet.innerQuorumSets.forEach((innerQSet) => {
			if (innerQSet.validators.length === 0) {
				return;
			}
			const organizationId = this.getNodeByPublicKey(
				innerQSet.validators[0]
			).organizationId;
			if (
				organizationId === null ||
				this.getOrganizationById(organizationId) === undefined
			) {
				return;
			}

			if (
				!innerQSet.validators
					.map((validator) => this.getNodeByPublicKey(validator))
					.every(
						(validator, index, validators) =>
							validator.organizationId === validators[0].organizationId
					)
			) {
				return;
			}

			trustedOrganizations.push(this.getOrganizationById(organizationId));
			trustedOrganizations.push(...this.getTrustedOrganizations(innerQSet));
		});

		return trustedOrganizations;
	}

	protected getPublicKeyToNodeMap(nodes: Node[]): Map<string, Node> {
		return new Map(
			nodes
				.filter((node) => node.publicKey)
				.map((node) => [node.publicKey, node])
		);
	}

	getTrustedOrganizationsByOrganization(organization: Organization) {
		const trustedOrganizations: Organization[] = [];
		organization.validators.forEach((publicKey) => {
			const validator = this.getNodeByPublicKey(publicKey);
			this.getTrustedOrganizations(validator.quorumSet).forEach((org) => {
				if (org.id !== organization.id) trustedOrganizations.push(org);
			});
		});
		return Array.from(new Set(trustedOrganizations)); //remove doubles
	}

	/*
         By crawling we know if nodes are watchers (never sent any SCP message) or validators (participating in SCP)
         We mark validators that are not sending SCP externalize messages as missing.
         We mark watchers that are not live as missing.
         TODO: should only be missing when not participating in consensus.
          When participating in consensus but not sending externalize messages, they could be blocked based on quorumSet blocking status
         */
	isNodeMissing(node: Node) {
		if (!node.isValidator)
			//watchers are marked missing when we cannot connect to them
			return !node.active;

		return !node.isValidating;
	}

	/**
	 * A node can fail for various reasons. See Fig. 5.   Venn diagram of node failures of the original SCP paper.
	 * When a node is missing we mark it as failed.
	 * If we modify the network for simulation purposes, we mark validators that are blocked as failed.
	 */
	isNodeFailing(node: Node) {
		//if a node is blocked, we mark it as failed for simulation purposes
		if (this.blockedNodes.has(node.publicKey)) return true;

		return this.isNodeMissing(node);
	}

	/*
    Everytime the network is modified for simulation purposes we check if validators can reach their quorumSet thresholds.
    If not we mark them as 'blocked'.
     */
	isValidatorBlocked(validator: Node) {
		return this.blockedNodes.has(validator.publicKey);
	}

	someNodesHaveWarnings(nodes: Node[]) {
		return nodes.some((node) => this.nodeHasWarnings(node));
	}

	nodeHasWarnings(node: Node) {
		return this.isFullValidatorWithOutOfDateArchive(node);
	}

	getNodeWarningReasons(node: Node) {
		if (this.isFullValidatorWithOutOfDateArchive(node))
			return 'History archive not up-to-date';

		return 'None';
	}

	isFullValidatorWithOutOfDateArchive(node: Node) {
		return node.historyUrl && !node.isFullValidator;
	}

	getNodeFailingReason(node: Node): { label: string; description: string } {
		if (!node.active && !node.isValidator)
			return {
				label: 'Failing',
				description: 'Unable to connect to node during latest crawl'
			};

		if (node.isValidator && !node.quorumSet.hasValidators())
			return {
				label: 'Failing',
				description: 'Quorum set not yet detected by crawler'
			};
		if (node.isValidator && this.isNodeMissing(node))
			return {
				label: 'Failing',
				description: 'Not validating in latest consensus rounds'
			};

		if (node.isValidator && this.isValidatorBlocked(node))
			return {
				label: 'Blocked',
				description: 'Quorum set not reaching threshold'
			};

		return {
			label: 'Live',
			description: 'Live'
		};
	}

	static fromJSON(networkJSON: string | Record<string, unknown>): Network {
		let networkDTO: Record<string, unknown>;
		if (typeof networkJSON === 'string') {
			networkDTO = JSON.parse(networkJSON);
		} else networkDTO = networkJSON;

		if (!Array.isArray(networkDTO.nodes))
			throw new Error('Node property must be array');

		const nodes = networkDTO.nodes.map((node: Record<string, unknown>) =>
			Node.fromJSON(node)
		);

		if (!Array.isArray(networkDTO.organizations))
			throw new Error('organizations property must be array');
		const organizations = networkDTO.organizations.map(
			(organization: Record<string, unknown>) =>
				Organization.fromJSON(organization)
		);

		if (!isObject(networkDTO.statistics))
			throw new Error('statistics property missing');

		const networkStatistics = NetworkStatistics.fromJSON(networkDTO.statistics);

		const timeValue = networkDTO.time;
		let time: Date;
		if (typeof timeValue === 'string') {
			time = new Date(timeValue);
		} else {
			time = new Date();
		}

		const latestLedger: string | null = isString(networkDTO.latestLedger)
			? networkDTO.latestLedger
			: null;

		const network = new Network(
			nodes,
			organizations,
			time,
			latestLedger,
			networkStatistics
		);

		if (isString(networkDTO.id)) network.id = networkDTO.id;

		if (isString(networkDTO.name)) network.name = networkDTO.name;

		return network;
	}

	toJSON(): Record<string, unknown> {
		return {
			id: this.id,
			name: this.name,
			time: this.time,
			latestLedger: this.latestLedger,
			transitiveQuorumSet: Array.from(
				this.nodesTrustGraph.networkTransitiveQuorumSet
			),
			scc: this.nodesTrustGraph.stronglyConnectedComponents
				.filter((scp) => scp.size > 1)
				.map((scp) => Array.from(scp)),
			nodes: this.nodes,
			organizations: this.organizations,
			statistics: this.networkStatistics
		};
	}
}

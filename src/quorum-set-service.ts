import { QuorumSet } from './quorum-set';
import { TrustGraph } from './trust-graph/trust-graph';
import { Network, PublicKey } from './network';
import { Node } from './node';

export class QuorumSetService {
	/*
    //network is only needed to fetch nodes by Id, ideally this should be abstracted in repository
     */
	public static quorumSetCanReachThreshold(
		quorumSet: QuorumSet,
		network: Network,
		blockedNodes: Set<PublicKey>
	) {
		//
		let counter = quorumSet.validators
			.map((validator) => network.getNodeByPublicKey(validator))
			.filter(
				(validator) =>
					validator.isValidating && !blockedNodes.has(validator.publicKey)
			).length;

		quorumSet.innerQuorumSets.forEach((innerQS) => {
			if (this.quorumSetCanReachThreshold(innerQS, network, blockedNodes)) {
				counter++;
			}
		});

		return counter >= quorumSet.threshold;
	}

	/**
	 * Determine blocked nodes that cannot reach their quorumset thresholds (recursively) after validating status of
	 * other nodes are changed
	 * @param network
	 * @param nodesTrustGraph
	 */
	public static calculateBlockedNodes(
		network: Network,
		nodesTrustGraph: TrustGraph
	) {
		const nodesToCheck = network.nodes.filter((node) => node.isValidator);
		const blockedNodes: Set<PublicKey> = new Set();
		const inNodesToCheckQueue: Map<PublicKey, boolean> = new Map();

		nodesToCheck.forEach((node) =>
			inNodesToCheckQueue.set(node.publicKey, true)
		);

		while (nodesToCheck.length > 0) {
			const nodeToCheck = nodesToCheck.pop()!;
			inNodesToCheckQueue.set(nodeToCheck.publicKey, false);

			if (
				blockedNodes.has(nodeToCheck.publicKey) ||
				(!nodeToCheck.isValidating && !nodeToCheck.participatingInSCP)
			) {
				continue; //already blocked or not validating, thus no change in situation that could cause other nodes to fail
			}

			if (
				QuorumSetService.quorumSetCanReachThreshold(
					nodeToCheck.quorumSet,
					network,
					blockedNodes
				)
			) {
				continue; //working as expected
			}

			//node is failing
			blockedNodes.add(nodeToCheck.publicKey);

			if (!nodeToCheck.isValidating) continue;
			//node was already not validating, so we don't need to check parents for impact of adding to blocked nodes

			const vertexToCheck = nodesTrustGraph.getVertex(nodeToCheck.publicKey);
			if (!vertexToCheck) continue; //this should not happen;

			Array.from(nodesTrustGraph.getParents(vertexToCheck))
				.filter((vertex) => inNodesToCheckQueue.get(vertex.key) === false)
				.forEach((vertex) => {
					const node = network.getNodeByPublicKey(vertex.key);
					nodesToCheck.push(node);
					inNodesToCheckQueue.set(node.publicKey, true);
				});
		}

		return blockedNodes;
	}

	//checks one level of inner quorumsets
	public static quorumSetHasFailingValidators(
		quorumSet: QuorumSet,
		network: Network
	) {
		return (
			quorumSet.validators
				.map((validator) => network.getNodeByPublicKey(validator)!)
				.some((validator) => network.isNodeFailing(validator)) ||
			quorumSet.innerQuorumSets.some((quorumSet) => {
				return quorumSet.validators
					.map((validator) => network.getNodeByPublicKey(validator)!)
					.some((validator) => network.isNodeFailing(validator));
			})
		);
	}

	//textual information on possible dangers for the given quorumset
	public static quorumSetHasDangers(
		node: Node,
		quorumSet: QuorumSet,
		network: Network
	) {
		if (!quorumSet.hasValidators())
			return 'Quorumset not yet detected by crawler';

		if (network.isQuorumSetBlocked(node, quorumSet))
			//todo: think about correct location of this function
			return 'Quorumset not reaching threshold';

		return 'None';
	}

	public static getQuorumSetDangers(
		node: Node,
		quorumSet: QuorumSet,
		network: Network
	) {
		if (!quorumSet.hasValidators())
			return 'Quorum set not yet detected by crawler';

		if (network.isQuorumSetBlocked(node, quorumSet))
			return 'Quorum set not reaching threshold';

		return 'None';
	}

	public static getQuorumSetWarnings(quorumSet: QuorumSet, network: Network) {
		if (QuorumSetService.quorumSetHasFailingValidators(quorumSet, network))
			return 'Some validators are failing';

		if (QuorumSetService.quorumSetHasWarnings(quorumSet, network))
			return 'Some history archives are out-of-date';
	}

	//checks one level of inner quorumSets
	public static quorumSetHasWarnings(quorumSet: QuorumSet, network: Network) {
		return (
			quorumSet.validators
				.map((validator) => network.getNodeByPublicKey(validator))
				.some(
					(validator) =>
						network.nodeHasWarnings(validator) ||
						network.isNodeFailing(validator)
				) ||
			quorumSet.innerQuorumSets.some((quorumSet) => {
				return quorumSet.validators
					.map((validator) => network.getNodeByPublicKey(validator))
					.some(
						(validator) =>
							network.nodeHasWarnings(validator) ||
							network.isNodeFailing(validator)
					);
			})
		);
	}

	public static isOrganizationQuorumSet(
		quorumSet: QuorumSet,
		network: Network
	): boolean {
		if (quorumSet.validators.length === 0) {
			return false;
		}

		const organizationId = network.getNodeByPublicKey(
			quorumSet.validators[0]
		)!.organizationId;
		if (
			organizationId === null ||
			network.getOrganizationById(organizationId) === undefined
		) {
			return false;
		}

		return quorumSet.validators
			.map((validator) => network.getNodeByPublicKey(validator)!)
			.every(
				(validator, index, validators) =>
					validator.organizationId === validators[0].organizationId
			);
	}
}

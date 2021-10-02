import { Network, OrganizationId, PublicKey } from '../network';
import { Node } from '../node';
import { QuorumSet } from '../quorum-set';
import {
	StronglyConnectedComponentsFinder,
	StronglyConnectedComponent
} from './strongly-connected-components-finder';
import { NetworkTransitiveQuorumSetFinder } from './network-transitive-quorum-set-finder';
import { TrustGraph, Edge, Vertex, isVertex } from './trust-graph';
import { QuorumSetService } from '../quorum-set-service';
import { isOrganization, Organization } from '../organization';

export class TrustGraphBuilder {
	/*
    Network is used to fetch nodes and organizations by ID, ideally this should come from a repository, and not the entire network service.
     */
	protected network: Network;

	constructor(network: Network) {
		this.network = network;
	}

	buildGraphFromOrganizations(nodesTrustGraph: TrustGraph) {
		let graph = new TrustGraph(
			new StronglyConnectedComponentsFinder(),
			new NetworkTransitiveQuorumSetFinder()
		);

		//add vertices
		this.network.organizations.forEach((organization) => {
			graph.addVertex(
				new Vertex(
					organization.id,
					organization.name,
					1 //todo: index
				)
			);
		});

		//add edges
		graph.vertices.forEach((organizationVertex) => {
			let organization = this.network.getOrganizationById(
				organizationVertex.key
			);
			if (!organization) return;

			organization.validators.forEach((validator) => {
				QuorumSet.getAllValidators(
					this.network.getNodeByPublicKey(validator).quorumSet
				)
					.map(
						(validator) =>
							this.network.getNodeByPublicKey(validator).organizationId
					)
					.filter((organizationId) => organizationId !== undefined)
					.map((organizationId) =>
						this.network.getOrganizationById(organizationId!)
					)
					.forEach((trustedOrganization) => {
						let trustedOrganizationVertex = graph.getVertex(
							trustedOrganization.id
						);
						if (!isVertex(trustedOrganizationVertex)) return;
						if (!graph.hasChild(organizationVertex, trustedOrganizationVertex))
							graph.addEdge(
								new Edge(organizationVertex, trustedOrganizationVertex!)
							);
					});
			});
		});

		graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();

		return graph;
	}

	buildGraphFromNodes(includeWatchers: boolean = false): TrustGraph {
		let graph = new TrustGraph(
			new StronglyConnectedComponentsFinder(),
			new NetworkTransitiveQuorumSetFinder()
		);

		this.network.nodes //first we create the vertices
			.filter((node) => node.isValidator || includeWatchers)
			.forEach((node) => {
				graph.addVertex(
					new Vertex(node.publicKey, node.displayName, node.index)
				);
			});

		graph.vertices.forEach((vertex) => {
			//now we add the edges, the trust connections
			let node = this.network.getNodeByPublicKey(vertex.key);

			this.addNodeEdges(vertex, node.quorumSet, graph);
		});

		graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();
		return graph;
	}

	protected addNodeEdges(
		parent: Vertex,
		quorumSet: QuorumSet,
		graph: TrustGraph
	) {
		let validators = QuorumSet.getAllValidators(quorumSet);
		validators.forEach((validator) => {
			let vertex = graph.getVertex(validator);
			/*if (!vertex) {//it could be that a node is not yet detected validating, but is included in quorumsets.
                let node = this.network.getNodeByPublicKey(validator);//perhaps we already discovered it as a watcher
                if (!node)//if not let's add an unknown node
                    node = new Node(validator);

                vertex = new Vertex(validator, node.displayName, node.index);
                graph.addVertex(vertex);
            }*/ //if we add a node where we have no quorumset information, adding that node could break transitive quorumset calculation (outgoing edges?). Another solution is to introduce an 'unknown' property to vertex and filter it out in sensitive calculations. For now we remove it from the graph.
			if (vertex) graph.addEdge(new Edge(parent, vertex));
		});
	}
}

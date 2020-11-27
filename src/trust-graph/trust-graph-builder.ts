import {Network, OrganizationId, PublicKey} from "../network";
import {Node} from "../node";
import {QuorumSet} from "../quorum-set";
import {StronglyConnectedComponentsFinder, StronglyConnectedComponent} from "./strongly-connected-components-finder";
import {NetworkTransitiveQuorumSetFinder} from "./network-transitive-quorum-set-finder";
import {TrustGraph, Edge, Vertex, isVertex} from "./trust-graph";
import {QuorumSetService} from "../quorum-set-service";
import {isOrganization, Organization} from "../organization";

export class TrustGraphBuilder {

    buildGraphFromOrganizations(network: Network) {
        let graph = new TrustGraph(new StronglyConnectedComponentsFinder(), new NetworkTransitiveQuorumSetFinder());

        //add vertices
        network.organizations.forEach(organization => {
            graph.addVertex(new Vertex(
                organization.id,
                organization.name,
                organization.subQuorumAvailable,
                1 //todo: index
            ))
        })

        //add edges
        graph.vertices.forEach(organizationVertex => {
            let organization = network.getOrganizationById(organizationVertex.key);
            if (!organization)
                return;

            organization.validators.forEach(validator => {
                QuorumSet.getAllValidators(network.getNodeByPublicKey(validator).quorumSet)
                    .map(validator => network.getNodeByPublicKey(validator).organizationId)
                    .filter(organizationId => organizationId !== undefined)
                    .map(organizationId => network.getOrganizationById(organizationId!))
                    .forEach(trustedOrganization => {
                        let trustedOrganizationVertex = graph.getVertex(trustedOrganization.id);
                        if (!isVertex(trustedOrganizationVertex))
                            return;
                        if(!graph.hasChild(organizationVertex, trustedOrganizationVertex))
                            graph.addEdge(new Edge(organizationVertex, trustedOrganizationVertex!))
                    })
            })
        });

        return graph;

    }

    buildGraphFromNodes(network: Network, includeWatchers: boolean = false): TrustGraph {
        let graph = new TrustGraph(new StronglyConnectedComponentsFinder(), new NetworkTransitiveQuorumSetFinder());

        network.nodes //first we create the vertices
            .filter(node => node.isValidator || includeWatchers)
            .forEach(
                node => {
                    graph.addVertex(new Vertex(
                        node.publicKey,
                        node.displayName,
                        !node.active || (node.isValidator && !node.isValidating),
                        node.index
                        )
                    );
                }
            );

        graph.vertices.forEach(vertex => { //now we add the edges, the trust connections
            let node = network.getNodeByPublicKey(vertex.key);
            this.addNodeEdges(vertex, node!.quorumSet, graph);
        });

        this.updateFailedVertices(network, graph);
        graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();

        return graph;
    }

    public updateNodesGraphWithFailingVertices(network: Network, graph: TrustGraph, failingPublicKeys: PublicKey[]): void {
        failingPublicKeys
            .map(publicKey => graph.getVertex(publicKey))
            .filter(isVertex)
            .map(vertex => vertex.failing = true);

        this.updateFailedVertices(network, graph);
    }

    protected addNodeEdges(parent: Vertex, quorumSet: QuorumSet, graph: TrustGraph) {
        let validators = QuorumSet.getAllValidators(quorumSet);
        validators
            .map(validator => graph.getVertex(validator))
            .filter(isVertex)
            .forEach(validatorVertex => graph.addEdge(new Edge(parent!, validatorVertex)));
    }

    protected updateFailedVertices(network: Network, graph: TrustGraph, verticesToCheck: Array<Vertex> = []) {
        if (verticesToCheck.length === 0) {
            verticesToCheck = Array.from(graph.vertices.values()).filter(vertex => !vertex.failing);
            //no reason to check already failing vertices
        }

        let inVerticesToCheckQueue: Map<PublicKey, boolean> = new Map();

        verticesToCheck.forEach(vertex => inVerticesToCheckQueue.set(vertex.key, true));

        while (verticesToCheck.length > 0) {
            let vertexToCheck = verticesToCheck.pop()!;
            inVerticesToCheckQueue.set(vertexToCheck.key, false);

            if (vertexToCheck.failing) {
                continue; //already failing
            }

            if (QuorumSetService.quorumSetCanReachThreshold(network.getNodeByPublicKey(vertexToCheck.key).quorumSet, graph)
            ) {
                continue; //working as expected
            }

            //node is failing
            vertexToCheck.failing = true;

            Array.from(graph.getParents(vertexToCheck))
                .filter(vertex => inVerticesToCheckQueue.get(vertex.key) === false)
                .forEach(vertex => {
                    verticesToCheck.push(vertex);
                    inVerticesToCheckQueue.set(vertex.key, true);
                });
        }
    }
}
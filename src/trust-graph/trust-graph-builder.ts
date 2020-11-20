import {PublicKey} from "../network";
import {Node} from "../node";
import {QuorumSet} from "../quorum-set";
import {StronglyConnectedComponentsFinder, StronglyConnectedComponent} from "./strongly-connected-components-finder";
import {NetworkTransitiveQuorumSetFinder} from "./network-transitive-quorum-set-finder";
import {TrustGraph, Edge, Vertex, isVertex} from "./trust-graph";
import {QuorumSetService} from "../quorum-set-service";

export class TrustGraphBuilder {

    buildGraphFromNodes(nodes: Node[], includeWatchers: boolean = false): TrustGraph {
        let graph = new TrustGraph(new StronglyConnectedComponentsFinder(), new NetworkTransitiveQuorumSetFinder());
        let publicKeyToNodesMap = new Map<PublicKey, Node>();

        nodes //first we create the vertices
            .filter(node => node.isValidator || includeWatchers)
            .forEach(
                node => {
                    publicKeyToNodesMap.set(node.publicKey, node);
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
            let node = publicKeyToNodesMap.get(vertex.key);
            this.addNodeEdges(vertex, node!.quorumSet, graph);
        });

        this.updateBlockedVertices(publicKeyToNodesMap, graph);
        graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();

        return graph;
    }

    public updateGraphWithFailingVertices(publicKeyToNodesMap: Map<PublicKey, Node>, graph: TrustGraph, failingPublicKeys: PublicKey[]): void {
        failingPublicKeys
            .map(publicKey => graph.getVertex(publicKey))
            .filter(isVertex)
            .map(vertex => vertex.missing = true);

        this.updateBlockedVertices(publicKeyToNodesMap, graph);
        graph.updateStronglyConnectedComponentsAndNetworkTransitiveQuorumSet();
    }

    protected addNodeEdges(parent: Vertex, quorumSet: QuorumSet, graph: TrustGraph) {
        let validators = QuorumSet.getAllValidators(quorumSet);
        validators
            .map(validator => graph.getVertex(validator))
            .filter(isVertex)
            .forEach(validatorVertex => graph.addEdge(new Edge(parent!, validatorVertex)));
    }

    protected updateBlockedVertices(publicKeyToNodesMap: Map<PublicKey, Node>, graph: TrustGraph, verticesToCheck: Array<Vertex> = []) { //should be handled at node level, but requires major refactoring
        if (verticesToCheck.length === 0) {
            verticesToCheck = Array.from(graph.vertices.values()).filter(vertex => vertex.available);
            //no reason to check already failing vertices
        }

        let inVerticesToCheckQueue: Map<PublicKey, boolean> = new Map();

        verticesToCheck.forEach(vertex => inVerticesToCheckQueue.set(vertex.key, true));

        while (verticesToCheck.length > 0) {
            let vertexToCheck = verticesToCheck.pop()!;
            inVerticesToCheckQueue.set(vertexToCheck.key, false);

            if (!vertexToCheck.available) {
                continue; //already failing
            }

            if (QuorumSetService.quorumSetCanReachThreshold(publicKeyToNodesMap.get(vertexToCheck.key)!.quorumSet, graph)
            ) {
                continue; //working as expected
            }

            //node is failing
            vertexToCheck.blocked = true;

            Array.from(graph.getParents(vertexToCheck))
                .filter(vertex => inVerticesToCheckQueue.get(vertex.key) === false)
                .forEach(vertex => {
                    verticesToCheck.push(vertex);
                    inVerticesToCheckQueue.set(vertex.key, true);
                });
        }
    }
}
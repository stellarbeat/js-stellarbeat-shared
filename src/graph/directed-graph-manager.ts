import {PublicKey} from "../network";
import {Node} from "../node";
import {QuorumSet} from "../quorum-set";
import {StronglyConnectedComponentsFinder, StronglyConnectedComponent} from "./strongly-connected-components-finder";
import {TransitiveQuorumSetFinder} from "./transitive-quorum-set-finder";
import {DirectedGraph, Edge, Vertex} from "./directed-graph";

export class DirectedGraphManager {
    buildGraphFromNodes(nodes: Node[]): DirectedGraph {
        let graph = new DirectedGraph(new StronglyConnectedComponentsFinder(), new TransitiveQuorumSetFinder());
        let nodesMap = new Map(nodes
            .filter(node => node.publicKey)
            .map(node => [node.publicKey, node])
        );
        nodes.forEach(
            node => {
                if(!node.isValidator)
                    return;
                let vertex = graph.getVertex(node.publicKey);
                if (!vertex) {
                    vertex = new Vertex(node.publicKey, node.displayName, node.isValidating, node.index);
                    graph.addVertex(vertex);
                }
                QuorumSet.getAllValidators(node.quorumSet)
                    .map(validatorPublicKey => nodesMap.get(validatorPublicKey))
                    .filter(validator => validator !== undefined)
                    .forEach(validator => {
                        let validatorVertex = graph.getVertex(validator!.publicKey);
                        if (!validatorVertex) {
                            validatorVertex = new Vertex(
                                validator!.publicKey,
                                validator!.displayName,
                                validator!.isValidating,
                                validator!.index
                            );
                            graph.addVertex(validatorVertex);
                        }
                        let edge = new Edge(
                            vertex as Vertex,
                            validatorVertex
                        );

                        graph.addEdge(edge);
                    })
            }
        );

        graph.updateStronglyConnectedComponentsAndTransitiveQuorumSet();

        return graph;
    }

    updateGraphWithFailingNodes(failingNodes: Array<PublicKey>, graph: DirectedGraph, nodes:Node[]) {
        let nodesMap = new Map(nodes
            .filter(node => node.publicKey)
            .map(node => [node.publicKey, node])
        );
        let verticesToCheck: Array<Vertex> = [];
        failingNodes
            .map(publicKey => graph.getVertex(publicKey))
            .filter(vertex => vertex !== undefined)
            .map(vertex => {
                vertex!.isValidating = false;
                verticesToCheck.push(...Array.from(graph.getParents(vertex!)))
            });

        while (verticesToCheck.length > 0) {
            let vertexToCheck = verticesToCheck.pop()!;

            if (!vertexToCheck.isValidating) {
                continue; //already failing
            }

            if (!nodesMap.has(vertexToCheck.publicKey)) {
                throw new Error('Vertex not part of nodesMap: ' + vertexToCheck)
            }

            if (vertexToCheck.isValidating && this.quorumSetCanReachThreshold(graph, nodesMap.get(vertexToCheck.publicKey)!.quorumSet)) {
                continue; //working as expected
            }

            //node is failing
            vertexToCheck.isValidating = false;

            verticesToCheck.push(...Array.from(graph.getParents(vertexToCheck)));
        }

        graph.updateStronglyConnectedComponentsAndTransitiveQuorumSet();
    }

    protected quorumSetCanReachThreshold( //todo move
        graph: DirectedGraph,
        quorumSet: QuorumSet,
    ) { //
        let counter = quorumSet.validators
            .map(validator => graph.getVertex(validator))
            .filter(vertex => vertex !== undefined && vertex.isValidating)
            .length;

        quorumSet.innerQuorumSets.forEach(innerQS => {
            if (this.quorumSetCanReachThreshold(graph, innerQS)) {
                counter++;
            }
        });

        return counter >= quorumSet.threshold;
    }
}
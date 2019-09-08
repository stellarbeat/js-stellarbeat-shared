import {PublicKey} from "../network";
import {Node} from "../node";
import {QuorumSet} from "../quorum-set";
import {StronglyConnectedComponentsFinder, StronglyConnectedComponent} from "./strongly-connected-components-finder";
import {NetworkTransitiveQuorumSetFinder} from "./network-transitive-quorum-set-finder";
import {DirectedGraph, Edge, GraphQuorumSet, Vertex} from "./directed-graph";

export class DirectedGraphManager {

    public mapQuorumSet(quorumSet: QuorumSet): GraphQuorumSet{
        let graphQuorumSet = new GraphQuorumSet();
        graphQuorumSet.threshold = quorumSet.threshold;
        graphQuorumSet.validators = quorumSet.validators.slice();
        quorumSet.innerQuorumSets.forEach(
            innerQuorumSet => graphQuorumSet.innerGraphQuorumSets.push(this.mapQuorumSet(innerQuorumSet))
        );

        return graphQuorumSet;
    };

    buildGraphFromNodes(nodes: Node[]): DirectedGraph {
        let graph = new DirectedGraph(new StronglyConnectedComponentsFinder(), new NetworkTransitiveQuorumSetFinder());

        let vertices = nodes
            .filter(node => node.isValidator)
            .map(
                node =>
                    new Vertex(
                        node.publicKey,
                        node.displayName,
                        node.isValidating && node.active,
                        node.index,
                        this.mapQuorumSet(node.quorumSet)
                    )
            );
        graph.build(vertices);

        return graph;
    }
}
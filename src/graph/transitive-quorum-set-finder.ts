import {DirectedGraph, Vertex} from "./directed-graph";

type StronglyConnectedComponent = Set<Vertex>;

export class TransitiveQuorumSetFinder {

    protected determineTransitiveQuorumSet(stronglyConnectedComponents: Array<StronglyConnectedComponent>, graph:DirectedGraph):StronglyConnectedComponent {
        let scpNoOutgoingEdges: Array<StronglyConnectedComponent> = [];
        stronglyConnectedComponents.forEach(scp => {
            if (scp.size > 1 && !this.hasOutgoingEdgesNotPartOfComponent(scp, graph)) {
                scpNoOutgoingEdges.push(scp);
            }
        });

        let transitiveQuorumSet = scpNoOutgoingEdges[0];

        if (scpNoOutgoingEdges.length > 1) {
            //.log("multiple candidates for transitive quorumSet");
            let highestIndexAverage = 0;
            for (let i = 0; i < scpNoOutgoingEdges.length; i++) {
                let scp = scpNoOutgoingEdges[i];
                let weightSum = Array.from(scp).reduce((accumulator, vertex) => accumulator + vertex.weight, 0);
                let weightAverage = weightSum / scp.size;
                if (highestIndexAverage < weightAverage) {
                    transitiveQuorumSet = scp;
                    highestIndexAverage = weightAverage;
                }
            }
        }

        return transitiveQuorumSet;
    }

    protected hasOutgoingEdgesNotPartOfComponent(stronglyConnectedComponent: StronglyConnectedComponent, graph:DirectedGraph): boolean {
        let hasOutgoingEdgesNotPartOfComponent = false;
        stronglyConnectedComponent.forEach(vertex => {
            let outgoingEdgesNotInComponent = Array.from(graph
                .getChildren(vertex))
                .filter(
                    child => !stronglyConnectedComponent.has(child)
                );
            if (outgoingEdgesNotInComponent.length > 0)
                hasOutgoingEdgesNotPartOfComponent = true;
        });

        return hasOutgoingEdgesNotPartOfComponent;
    }
}
import {TrustGraph, isVertex, VertexKey} from "./trust-graph";
import {StronglyConnectedComponent} from "./strongly-connected-components-finder";

export class NetworkTransitiveQuorumSetFinder {

    public getTransitiveQuorumSet(stronglyConnectedComponents: Array<StronglyConnectedComponent>, graph:TrustGraph):StronglyConnectedComponent {
        let scpNoOutgoingEdges: Array<StronglyConnectedComponent> = [];
        stronglyConnectedComponents.forEach(scp => {
            if (scp.size > 1 && !this.hasOutgoingEdgesNotPartOfComponent(scp, graph)) {
                scpNoOutgoingEdges.push(scp);
            }
        });

        if(scpNoOutgoingEdges.length <= 0) {
            return new Set<VertexKey>();
        }

        let transitiveQuorumSet = scpNoOutgoingEdges[0];

        if (scpNoOutgoingEdges.length > 1) {
            let highestIndexAverage = 0;
            for (let i = 0; i < scpNoOutgoingEdges.length; i++) {
                let scp = scpNoOutgoingEdges[i];
                let weightSum = Array.from(scp)
                    .map(vertexKey => graph.getVertex(vertexKey))
                    .filter(isVertex)
                    .reduce((accumulator, vertex) => accumulator + vertex.weight, 0);
                let weightAverage = weightSum / scp.size;
                if (highestIndexAverage < weightAverage) {
                    transitiveQuorumSet = scp;
                    highestIndexAverage = weightAverage;
                }
            }
        }

        return transitiveQuorumSet;
    }

    protected hasOutgoingEdgesNotPartOfComponent(stronglyConnectedComponent: StronglyConnectedComponent, graph:TrustGraph): boolean {
        let hasOutgoingEdgesNotPartOfComponent = false;
        Array.from(stronglyConnectedComponent.values())
            .map(publicKey => graph.getVertex(publicKey))
            .filter(isVertex)
            .forEach(vertex => {
            let outgoingEdgesNotInComponent = Array.from(graph
                .getChildren(vertex))
                .filter(
                    child => child.available && !stronglyConnectedComponent.has(child.key)
                );
            if (outgoingEdgesNotInComponent.length > 0)
                hasOutgoingEdgesNotPartOfComponent = true;
        });

        return hasOutgoingEdgesNotPartOfComponent;
    }
}
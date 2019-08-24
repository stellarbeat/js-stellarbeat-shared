import {DirectedGraph} from "./directed-graph";
import {StronglyConnectedComponent} from "./strongly-connected-components-finder";

export class TransitiveQuorumSetFinder {

    public determineTransitiveQuorumSet(stronglyConnectedComponents: Array<StronglyConnectedComponent>, graph:DirectedGraph):StronglyConnectedComponent|undefined {
        let scpNoOutgoingEdges: Array<StronglyConnectedComponent> = [];
        stronglyConnectedComponents.forEach(scp => {
            if (scp.size > 1 && !this.hasOutgoingEdgesNotPartOfComponent(scp, graph)) {
                scpNoOutgoingEdges.push(scp);
            }
        });

        if(scpNoOutgoingEdges.length <= 0) {
            return undefined;
        }

        let transitiveQuorumSet = scpNoOutgoingEdges[0];

        if (scpNoOutgoingEdges.length > 1) {
            //.log("multiple candidates for transitive quorumSet");
            let highestIndexAverage = 0;
            for (let i = 0; i < scpNoOutgoingEdges.length; i++) {
                let scp = scpNoOutgoingEdges[i];
                let weightSum = Array.from(scp)
                    .map(publicKey => graph.getVertex(publicKey))
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

    protected hasOutgoingEdgesNotPartOfComponent(stronglyConnectedComponent: StronglyConnectedComponent, graph:DirectedGraph): boolean {
        let hasOutgoingEdgesNotPartOfComponent = false;
        Array.from(stronglyConnectedComponent.values())
            .map(publicKey => graph.getVertex(publicKey))
            .forEach(vertex => {
            let outgoingEdgesNotInComponent = Array.from(graph
                .getChildren(vertex))
                .filter(
                    child => child.isValidating && !stronglyConnectedComponent.has(child.publicKey)
                );
            if (outgoingEdgesNotInComponent.length > 0)
                hasOutgoingEdgesNotPartOfComponent = true;
        });

        return hasOutgoingEdgesNotPartOfComponent;
    }
}
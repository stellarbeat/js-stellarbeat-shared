import {QuorumSet} from "./quorum-set";
import {TrustGraph} from "./trust-graph/trust-graph";

export class QuorumSetService {
    public static quorumSetCanReachThreshold(quorumSet:QuorumSet, nodesTrustGraph: TrustGraph) { //
        let counter = quorumSet.validators
            .map(validator => nodesTrustGraph.getVertex(validator))
            .filter(vertex => vertex !== undefined && !vertex.failing)
            .length;

        quorumSet.innerQuorumSets.forEach(innerQS => {
            if (this.quorumSetCanReachThreshold(innerQS, nodesTrustGraph)) {
                counter++;
            }
        });

        return counter >= quorumSet.threshold;
    }
}
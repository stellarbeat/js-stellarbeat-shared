import {QuorumSet} from "./index";

export class QuorumSlicesGenerator {

    getSlices(quorumSet:QuorumSet):Array<Array<string>> {
        if (quorumSet.threshold > quorumSet.validators.length + quorumSet.innerQuorumSets.length) {
            return [];
        }

        if (quorumSet.threshold === 0) {
            return [];
        }

        return this.getCombinationsOfSizeK(
            quorumSet.threshold,
            ([] as any).concat(quorumSet.validators).concat(quorumSet.innerQuorumSets)
        );
    }

    getCombinationsOfSizeK(k:number, nodesOrQSets:Array<string> | Array<QuorumSet>) {
        let combinations:any[] = [];
        for (let i = 0; i < nodesOrQSets.length; i++) {

            let prefixes = [];

            if (nodesOrQSets[i] instanceof QuorumSet) {
                prefixes = this.getSlices(nodesOrQSets[i] as QuorumSet);
            } else {
                prefixes = [[nodesOrQSets[i]]];
            }

            if (k === 1) {
                prefixes.forEach(prefix => combinations.push(prefix));
            }

            else if ((k - 1 <= nodesOrQSets.length - i - 1)) { //not enough candidates left
                let postCombinations = this.getCombinationsOfSizeK(k - 1, nodesOrQSets.slice(i + 1, nodesOrQSets.length));
                prefixes.forEach(
                    prefix => postCombinations.forEach(
                        postCombination =>
                            combinations.push(prefix.concat(postCombination))
                    )
                );
            }
        }

        return combinations;
    }
}
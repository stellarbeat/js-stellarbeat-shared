import {QuorumSet} from "./quorum-set";
import {intersection, isEqual} from "lodash";
import {Node} from "./node";

//@ts-ignore
export default {

    getQuorumsInCluster(cluster:string[], map:Map<string, Node>){
        console.log("getting quorums in cluster: ");
        console.log(cluster);
        let combinationGenerator = this.getCombinationsGenerator(cluster);
        let next = combinationGenerator.next();
        let quorums = [];
        console.time("quorumCandidate");
        while(!next.done) {
            let quorumBitSet = next.value[0];
            let quorumCandidate = next.value[1];

            let isQuorum = true;
            quorumCandidate.some(nodePk => {
                if(map.get(nodePk)!.quorumSet.threshold > quorumCandidate.length) {
                    isQuorum = false;
                    return true; //stop loop
                }

                let hasSubsetSlice = this.hasSubSetQuorumSliceOuter(quorumBitSet, map.get(nodePk)!.quorumSet, cluster);

                if(!hasSubsetSlice) {
                    isQuorum = false;
                    return true;//stop loop
                }
            });
            if(isQuorum) {
                quorums.push(quorumCandidate);
            }

            next = combinationGenerator.next();
            console.timeEnd("quorumCandidate");
        }
        console.log("nr of quorums detected: " + quorums.length);
        console.log(quorums);

        return quorums;
    },

    hasQuorumIntersection(nodes:Node[], transitiveQuorumSet: string[], clusters:[string[]], map:Map<string, Node>) {
        console.time('hasQuorumIntersection');

        if(transitiveQuorumSet.length === 0)
            return false;

        let quorumsInTransitiveQuorumSet = this.getQuorumsInCluster(transitiveQuorumSet, map);

        if(quorumsInTransitiveQuorumSet.length === 0) {
            return false;
        }

        let intersectingQuorums = (quorumsInTransitiveQuorumSet.filter(
            quorum => quorumsInTransitiveQuorumSet.every(otherQuorum => intersection(otherQuorum, quorum).length > 0)
            )
        );

        if(intersectingQuorums.length !== quorumsInTransitiveQuorumSet.length){
            console.log("Quorums in leaf cluster do not overlap!");
            return false;
        }

        let otherClustersWithQuorums = clusters
            .filter(cluster => !isEqual(cluster, quorumsInTransitiveQuorumSet))
            .filter(cluster => this.getQuorumsInCluster(Array.from(cluster), map).length !== 0);

        console.timeEnd('hasQuorumIntersection');

        if(otherClustersWithQuorums.length === 0 ){
            console.log("QUORUM INTERSECTION!!! no other quorums exist without the nodes of the transitive quorum of the network, so all quorums must intersect")
            return true;
        }

        return false;
    },

    getBitRepresentation(validator: string, publicKeys: string[]){
        let index = publicKeys.indexOf(validator);
        return (1 << index);
    },

    hasSubSetQuorumSliceOuter: function (quorumBitSet: number, quorumSet: QuorumSet, cluster: string[]) {

        let validatorBitSets = quorumSet.validators.map(
            validator => this.getBitRepresentation(validator, cluster)
        );

        return this.hasSubSetQuorumSliceInner(quorumBitSet, validatorBitSets, quorumSet.threshold, quorumSet.innerQuorumSets, cluster)
    },

    hasSubSetQuorumSliceInner: function (quorumBitSet: number, validatorBitSets: number[], threshold: number, innerQuorums:QuorumSet[] = [], cluster:string[]) {
        for(let i = 0; i<validatorBitSets.length && threshold !== 0; i++){
            if( (validatorBitSets[i] & quorumBitSet) === validatorBitSets[i]) {
                threshold--; //match!
            }
        }

        for(let i = 0; i<innerQuorums.length && threshold !== 0; i++)
        {
            if(this.hasSubSetQuorumSliceOuter(quorumBitSet, innerQuorums[i], cluster)){
                threshold --; //match!
            }
        }

        return threshold === 0; //enough matches to satisfy threshold?
    },

    getCombinationsGenerator: function* (publicKeys:string[]):Generator<[number, string[]]> {
        let max = Math.pow(2,publicKeys.length);
        for(let i = 1; i<max;i++){
            let binary = i;
            let binaryIndex = 0;
            let currentCombination = [];
            while(binary !== 0) {
                if(binary & 1) {
                    currentCombination.push(publicKeys[binaryIndex]);
                }
                binary = binary >>> 1;
                binaryIndex ++;
            }

            yield [i, currentCombination];
        }
    }
};
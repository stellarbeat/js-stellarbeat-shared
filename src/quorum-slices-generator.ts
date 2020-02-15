import {Node, QuorumSet} from "./index";

let cache = new Map();
let cacheEnabled = true;

export class QuorumSlicesGenerator {
    // _cacheEnabled: boolean;
    // constructor(cacheEnabled = true){
    //     this._cacheEnabled = cacheEnabled;
    // }
    //
    // disableCache() {
    //     this._cacheEnabled = false;
    // };
    //
    // enableCache() {
    //     this._cacheEnabled = true;
    // }
    //
    // getSlices(quorumSet:QuorumSet):Array<Array<string>> {
    //
    //     if (quorumSet.threshold > quorumSet.validators.length + quorumSet.innerQuorumSets.length) {
    //         //console.log("not enough active validators for quorumSet: " + quorumSet.hashKey);
    //         return [];
    //     }
    //
    //     if (quorumSet.threshold === 0) {
    //         throw new Error('threshold cannot be zero');
    //     }
    //
    //     if(cache.has(quorumSet.hashKey) && this._cacheEnabled) {
    //         return cache.get(quorumSet.hashKey);
    //     }
    //
    //     let slices = this.getCombinationsOfSizeK(
    //         quorumSet.threshold,
    //         [].concat(quorumSet.validators).concat(quorumSet.innerQuorumSets)
    //     );
    //
    //     cache.set(quorumSet.hashKey, slices);
    //
    //     return slices;
    // }
    //
    // getCombinationsOfSizeK(k:number, nodesOrQSets:Array<string> | Array<QuorumSet>) {
    //     let combinations = [];
    //     for (let i = 0; i < nodesOrQSets.length; i++) {
    //
    //         let prefixes = [];
    //
    //         if (nodesOrQSets[i] instanceof QuorumSet) {
    //             prefixes = this.getSlices(nodesOrQSets[i] as QuorumSet);
    //         } else {
    //             prefixes = [[nodesOrQSets[i]]];
    //         }
    //
    //         if (k === 1) {
    //             prefixes.forEach(prefix => combinations.push(prefix));
    //         }
    //
    //         else if ((k - 1 <= nodesOrQSets.length - i - 1)) { //not enough candidates left
    //             let postCombinations = this.getCombinationsOfSizeK(k - 1, nodesOrQSets.slice(i + 1, nodesOrQSets.length));
    //             prefixes.forEach(
    //                 prefix => postCombinations.forEach(
    //                     postCombination =>
    //                         combinations.push(prefix.concat(postCombination))
    //                 )
    //             );
    //         }
    //     }
    //
    //     return combinations;
    // }
}
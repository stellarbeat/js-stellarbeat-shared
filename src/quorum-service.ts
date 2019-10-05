import {QuorumSet} from "./quorum-set";
import * as _ from "lodash";
import {Node} from "./node";
import {QuorumSlicesGenerator} from "./quorum-slices-generator";
import {PublicKey} from "./network";

let cacheEnabled = true;
let quorumSlicesGenerator = new QuorumSlicesGenerator(cacheEnabled);

export default {
    disableCache: function () {
        cacheEnabled = false;
    },

    getClusterLeafNodes: function (cluster, map) {
        let aNodeInCluster = cluster[0]; //every toNode leads to the same leafs.

        return this.getNodeChainRecursive(map.get(aNodeInCluster), map).filter(
            pk => {
                return this.getNodeChainRecursive(map.get(pk), map).indexOf(aNodeInCluster) === -1
            }
        )
    },

    /**
     * @deprecated use ClusterService
     * @param node
     * @param map
     */
    getCluster: function (node, map) {
        if(!node.quorumSet){
            return [];
        }

        return this.getNodeChainRecursive(node, map).filter(
            pk => this.getNodeChainRecursive(map.get(pk), map).indexOf(node.publicKey) > -1
        )
    },

    getNodesWithPublicKeys(nodes){
        return nodes.filter(node => node.publicKey);
    },

    getNodesWithQuorumSets(nodes){
        return nodes.filter(node => node.quorumSet);
    },

    getNodesWithQuorumSetsAndPublicKeys(nodes) {
        return _.flow([this.getNodesWithPublicKeys, this.getNodesWithQuorumSets])(nodes);
    },

    /**
     * @deprecated use ClusterService
     * @param nodes
     * @param map
     */
    getAllClusters(nodes, map) {
        let clusters = [];
        nodes.forEach(node => {
                let cluster = this.getCluster(node, map);
                if (clusters.every(alreadyDetectedCluster => !_.isEqual(alreadyDetectedCluster, new Set(cluster))
                    )) {
                    clusters.push(new Set(cluster));
                }
            }
        );

        return clusters;
    },

    getAllClusterLeafs(clusters, map) { //get clusters that don't depend on other clusters
        return clusters.filter(cluster => {
            return this.getClusterLeafNodes(Array.from(cluster), map).length === 0
            });
    },

    getQuorumsInCluster(cluster, map){
        console.log("getting quorums in cluster: ");
        console.log(cluster);
        let combinationGenerator = this.getCombinationsSuperFastGenerator(cluster);
        let next = combinationGenerator.next();
        let i = 0;
        let quorums = [];
        console.time("quorumCandidate");
        while(!next.done) {
            if(i%1000000 === 0) {
                console.log("i: " + i);
                console.timeEnd("quorumCandidate");
                console.time("quorumCandidate");
            }
            i++;
            let quorumBitSet = next.value[0];

            let quorumCandidate = next.value[1];

            //console.log("q: " + quorumCandidate);
            let isQuorum = true;
            quorumCandidate.some(nodePk => {

                if(map.get(nodePk).quorumSet.threshold > quorumCandidate.length) {
                    isQuorum = false;
                    return true; //stop loop
                }

                //console.log("qq");
                let hasSubsetSlice = this.hasSubSetQuorumSliceOuter(quorumBitSet, map.get(nodePk).quorumSet, cluster);

                if(!hasSubsetSlice) {
                    isQuorum = false;
                    return true;//stop loop
                }
            });
            if(isQuorum) {
                //console.log("ISAQUORUM: " + quorumCounter);
                quorums.push(quorumCandidate);
            } else {
                //console.log("NOQUORUM");
            }
            next = combinationGenerator.next();
            //console.timeEnd("quorumCandidate");
        }
        console.log("nr of quorums detected: " + quorums.length);

        return quorums;
    },

    hasQuorumIntersection(nodes, clusters, map) {
        console.time('hasQuorumIntersection');
        /*nodes = this.getNodesWithQuorumSetsAndPublicKeys(nodes);
        let map = this.getPublicKeyToNodeMap(nodes);*/

        //let clusters = this.getAllClusters(nodes, map); //todo filter out nodes from quorumSets that are not in given nodes array
        let clusterLeafs = this.getAllClusterLeafs(clusters, map);//todo filter out nodes from quorumSets that are not in given nodes array

        if(clusterLeafs.length !== 1) {
            throw new Error('something wrong, multiple leaf clusters means something wrong with the network');
        }

        let quorumsInLeaf = this.getQuorumsInCluster(Array.from(clusterLeafs[0]), map);

        if(quorumsInLeaf.length === 0) {
            throw new Error('something wrong, leafCluster has no quorums, this means these nodes can never reach consensus');
            //todo; filter out faulty nodes and start over
        }

        //todo do the leaf quorums intersect??
        let intersectingQuorums = (quorumsInLeaf.filter(
            quorum => quorumsInLeaf.every(otherQuorum => _.intersection(otherQuorum, quorum).length > 0)
            )
        );

        if(intersectingQuorums.length !== quorumsInLeaf.length){
            console.log("Quorums in leaf cluster do not overlap!");
            return false;
        }

        let otherClustersWithQuorums = clusters
            .filter(cluster => !_.isEqual(cluster, clusterLeafs[0]))
            .filter(cluster => this.getQuorumsInCluster(Array.from(cluster), map).length !== 0);

        if(otherClustersWithQuorums.length === 0 ){
            console.log("QUORUM INTERSECTION!!! no other quorums exist without the nodes of the leaf cluster, so all quorums must intersect")
        }
        console.timeEnd('hasQuorumIntersection');
        return otherClustersWithQuorums.length === 0;
    },

    getQuorums: function (nodes) {
        return this
            .getPossibleQuorums(nodes)
            .filter(
                possibleQuorum =>
                    this.isQuorum(
                        possibleQuorum,
                        this.getPublicKeyToNodeMap(nodes)
                    )
            )
    },

    filterInActiveValidators(quorumSet, map){
        if(!quorumSet) {
            return null;
        }

        quorumSet.validators = quorumSet.validators.filter(validator => map.has(validator));
        let filteredInnerQuorumSets = [];
        quorumSet.innerQuorumSets.forEach(innerQuorumSet => {
            let filteredQuorumSet = this.filterInActiveValidators(innerQuorumSet, map);
            if(filteredQuorumSet.size !== 0) {
                filteredInnerQuorumSets.push(filteredQuorumSet);
            }
        });

        quorumSet.innerQuorumSets = filteredInnerQuorumSets;

        return quorumSet;
    },

    /**
     * @deprecated use ClusterService
     * @param node
     * @param publicKeysToNodesMap
     * @param processedPublicKeys
     */
    getNodeChainRecursive: function(node, publicKeysToNodesMap, processedPublicKeys = []) {
        if(processedPublicKeys.indexOf(node.publicKey) >= 0)
            return processedPublicKeys;

        processedPublicKeys.push(node.publicKey);
        if(!node.quorumSet)
            return processedPublicKeys;

        return QuorumSet.getAllValidators(node.quorumSet)
            .filter(validator => processedPublicKeys.indexOf(validator) < 0)
            .filter(validator => publicKeysToNodesMap.get(validator))
            .filter(validator => publicKeysToNodesMap.get(validator).quorumSet)
            .map(validator =>
               publicKeysToNodesMap.get(validator)
            )
            .reduce(
                (processedPublicKeys, unProcessedNode) => this.getNodeChainRecursive(unProcessedNode, publicKeysToNodesMap, processedPublicKeys),
                processedPublicKeys
            );
    },

    isQuorum: function (quorumCandidate, publicKeyToNodesMap) {
        //console.time("isquorum");
        let result = this.allNodesContainASliceForEachMemberOfQuorum(quorumCandidate, publicKeyToNodesMap); //every toNode has a slice
        //console.timeEnd("isquorum");
        return result;
    },

    allNodesContainASliceForEachMemberOfQuorum: function (quorum, publicKeyToNodesMap) {
        return this.getNodesThatContainASliceForEachMemberOfQuorum(quorum, publicKeyToNodesMap).length === quorum.length;
    },

    getNodesThatContainASliceForEachMemberOfQuorum: function (quorum, publicKeyToNodesMap) {
        //console.time("getNodesThatContainASliceForEachMemberOfQuorum");
        let nodes = quorum.filter(
            publicKey => publicKeyToNodesMap.get(publicKey)
                && this.hasSliceThatIsASubsetOfQuorum(
                    publicKeyToNodesMap.get(publicKey).quorumSet,
                    quorum
                )
        );
        //console.timeEnd("getNodesThatContainASliceForEachMemberOfQuorum");
        return nodes;
    },

    hasSliceThatIsASubsetOfQuorum: function (quorumSet, quorum) {
        //console.time("hasSliceThatIsASubsetOfQuorum");
        let slices = quorumSlicesGenerator.getSlices(quorumSet); //todo YIELD
        let hasSubsetSlice = false;
        slices.some(slice => {
            if(this.isSliceSubsetOfQuorum(slice,quorum)) {
                hasSubsetSlice = true;
            }
            return hasSubsetSlice;
        });

        //console.timeEnd("hasSliceThatIsASubsetOfQuorum");
        return hasSubsetSlice;
    },

    getPossibleQuorums: function (nodes) {
        return this.getAllCombinations(
            this.getNodesPublicKeysWithQuorumSets(nodes)
        );
    },

    getNodesPublicKeysWithQuorumSets: function (nodes) {
        return nodes.filter(node => node.quorumSet).map(node => node.publicKey);
    },

    isSliceSubsetOfQuorum: function (slice, quorum) {
        //console.time("isSliceSubsetOfQuorum");
        let bool = slice.every(node => quorum.indexOf(node) > -1);
        //console.timeEnd("isSliceSubsetOfQuorum");
        return bool;
    },

    getPublicKeyToNodeMap(nodes):Map<string, Node> {
        return new Map(nodes
            .filter(node => node.publicKey)
            .map(node => [node.publicKey, node])
        );
    },

    getBitRepresentation(validator, publicKeys){
        let index = publicKeys.indexOf(validator);
        return (1 << index);
    },

    hasSubSetQuorumSliceOuter: function (quorumBitSet, quorumSet, cluster) {

        let validatorBitSets = quorumSet.validators.map(
            validator => this.getBitRepresentation(validator, cluster)
        );

        return this.hasSubSetQuorumSliceInner(quorumBitSet, validatorBitSets, quorumSet.threshold, quorumSet.innerQuorumSets, cluster)
    },

    hasSubSetQuorumSliceInner: function (quorumBitSet, validatorBitSets, threshold, innerQuorums = [], cluster) {
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

    getAllCombinations: function(nodes) {
        return this.getCombinationsSuperFast(nodes
        );
    },

    getCombinationsSuperFast: function (publicKeys) {
        let combinations = [];
        for(let i = 1; i<Math.pow(2,publicKeys.length);i++){
            //console.log(i);
            let binary = i;
            let binaryIndex = 0;
            let currentCombination = [];
            ////console.time("run");
            while(binary !== 0) {
                if(binary & 1) {
                    currentCombination.push(publicKeys[binaryIndex]);
                }
                binary = binary >>> 1;
                binaryIndex ++;
            }
            ////console.timeEnd("run");
            //yield currentCombination;
            combinations.push(currentCombination);
        }

        return combinations;
    },

    getCombinationsSuperFastGenerator: function* (publicKeys):Generator {
        let max = Math.pow(2,publicKeys.length);
        for(let i = 1; i<max;i++){
            ////console.time("run");

            //console.log(i);
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
            ////console.timeEnd("run");
        }
    }
};
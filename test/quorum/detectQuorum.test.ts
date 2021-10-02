import {Node, QuorumSet} from "../../src";
import detectQuorum from "../../src/quorum/detectQuorum";

let nodeA = new Node("A");
let nodeB = new Node("B");
let nodeC = new Node("C");
let nodeD = new Node("D");
let nodeE = new Node("E");
let nodeF = new Node("F");

nodeA.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeC.publicKey];
nodeA.quorumSet.threshold = 3;
nodeB.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeC.publicKey];
nodeB.quorumSet.threshold = 3;
nodeC.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeC.publicKey];
nodeC.quorumSet.threshold = 3;
nodeD.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeE.publicKey];
nodeD.quorumSet.threshold = 3;
nodeE.quorumSet.innerQuorumSets.push(new QuorumSet( 2, [nodeA.publicKey, nodeB.publicKey]));
nodeE.quorumSet.innerQuorumSets.push(new QuorumSet( 1, [nodeC.publicKey]));
nodeE.quorumSet.threshold = 2;
nodeF.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeD.publicKey];
nodeF.quorumSet.threshold = 3;

test('detectQuorum', () => {
    expect(detectQuorum([nodeA, nodeB, nodeC, nodeD])).toEqual([nodeA, nodeB, nodeC]);
    expect(detectQuorum([nodeA,nodeB, nodeC, nodeF, nodeD])).toEqual([nodeA, nodeB, nodeC]);//nodeF will only be filtered out in the second pass, when nodeD is removed
})
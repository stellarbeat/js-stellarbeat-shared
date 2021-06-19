import isQuorum from "../../src/quorum/isQuorum";
import {Node, QuorumSet} from "../../src";

let nodeA = new Node("A");
let nodeB = new Node("B");
let nodeC = new Node("C");
let nodeD = new Node("D");
let nodeE = new Node("E");

nodeA.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeC.publicKey];
nodeA.quorumSet.threshold = 3;
nodeB.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeC.publicKey];
nodeB.quorumSet.threshold = 3;
nodeC.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeC.publicKey];
nodeC.quorumSet.threshold = 3;
nodeD.quorumSet.validators = [nodeA.publicKey, nodeB.publicKey, nodeE.publicKey];
nodeD.quorumSet.threshold = 3;
nodeE.quorumSet.innerQuorumSets.push(new QuorumSet("key", 2, [nodeA.publicKey, nodeB.publicKey]));
nodeE.quorumSet.innerQuorumSets.push(new QuorumSet("key", 1, [nodeC.publicKey]));
nodeE.quorumSet.threshold = 2;

test('isQuorum', () => {
    expect(isQuorum([nodeA, nodeB, nodeC])).toBeTruthy();
    expect(isQuorum([nodeA, nodeB, nodeC, nodeD])).toBeFalsy();
    expect(isQuorum([nodeA, nodeB, nodeC, nodeE])).toBeTruthy();
});
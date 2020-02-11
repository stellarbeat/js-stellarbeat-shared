import {Node, Network, QuorumSet, generateTomlString} from '../src';

jest.mock('./../src/quorum-set-toml-generator');

let node1 = new Node('localhost', 20, 'a');
node1.active = true;
node1.isValidating = true;
node1.quorumSet.validators.push('b');
node1.quorumSet.threshold = 1;
let node2 = new Node('localhost', 20, 'b');
node2.quorumSet.threshold = 1;
node2.quorumSet.validators.push('a');
node2.active = true;
node2.isValidating = true;
node2.quorumSet.innerQuorumSets.push(new QuorumSet('failingqset', 5, ['c']));
let node3 = new Node('localhost', 20, 'c');
let node4 = new Node('localhost', 20, 'd');

node3.quorumSet.validators.push(node1.publicKey);
node4.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['a']));

let network = new Network([node1, node2, node3, node4]);

test('getQuorumSetTomlConfig', () => {
    network.getQuorumSetTomlConfig(node1.quorumSet);
    expect(generateTomlString).toBeCalledTimes(1);
});

test('getTrustingNodes', () => {
    expect(network.getTrustingNodes(node1)).toEqual([node2, node3, node4]);
});

test('isQuorumSetFailing', () => {
    expect(network.isQuorumSetFailing(node2)).toBeFalsy();
    expect(network.isQuorumSetFailing(node2, node2.quorumSet.innerQuorumSets[0])).toBeTruthy();
    expect(network.isQuorumSetFailing(node3)).toBeTruthy();
});

test('isNodeFailing', () => {
    expect(network.isNodeFailing(node1)).toBeFalsy();
    expect(network.isNodeFailing(node3)).toBeTruthy();
    expect(network.isNodeFailing(new Node('localhost', 11625, 'unknown'))).toBeTruthy();
});
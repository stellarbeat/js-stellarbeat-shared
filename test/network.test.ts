import {Node, Network, generateTomlString} from '../src';

jest.mock('./../src/quorum-set-toml-generator');

let node1 = new Node('localhost', 20, 'a');
let node2 = new Node('localhost', 20, 'b');
let node3 = new Node('localhost', 20, 'c');

node2.quorumSet.validators.push(node1.publicKey);
node3.quorumSet.validators.push(node1.publicKey);

let network = new Network([node1, node2, node3]);
console.log(node1.quorumSet.validators);

test('getLatestCrawlDate', () => {
    expect(network.latestCrawlDate).toEqual(node2.dateUpdated);
});

test('getQuorumSetTomlConfig', () => {
    network.getQuorumSetTomlConfig(node1.quorumSet);
    expect(generateTomlString).toBeCalledTimes(1);
});

test('getTrustingNodes', () => {
    expect(network.getTrustingNodes(node1)).toEqual([node2, node3]);
});
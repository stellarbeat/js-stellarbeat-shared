import {Node, Network, generateTomlString} from '../src';

jest.mock('./../src/quorum-set-toml-generator');

let node1 = new Node('localhost');

let node2 = new Node('localhost');

let network = new Network([node1, node2]);

test('getLatestCrawlDate', () => {
    expect(network.latestCrawlDate).toEqual(node2.dateUpdated);
});

test('getQuorumSetTomlConfig', () => {
    network.getQuorumSetTomlConfig(node1.quorumSet);
    expect(generateTomlString).toBeCalledTimes(1);
});
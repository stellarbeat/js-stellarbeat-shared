import {Node, Network} from '../src';

let node1 = new Node('localhost');

let node2 = new Node('localhost');

let network = new Network([node1, node2]);

test('getLatestCrawlDate', () => {
    expect(network.latestCrawlDate).toEqual(node2.dateUpdated);
});
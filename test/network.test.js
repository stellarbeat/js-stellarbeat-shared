const Network = require('../lib/network');
const Node = require('../lib/node');

let node1 = new Node();
console.log(node1.dateUpdated)
let node2 = new Node();

let network = new Network([node1, node2]);

test('getLatestCrawlDate', () => {
    expect(network.getLatestCrawlDate()).toEqual(node2.dateUpdated);
});
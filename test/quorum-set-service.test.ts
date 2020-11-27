import {QuorumSet, QuorumSetService, Node, TrustGraphBuilder, Network} from '../src';

let node0 = new Node("0");
node0.active = true;
node0.isValidating = true;
node0.quorumSet.threshold = 0;
let node1 = new Node("1");
node1.active = true;
node1.isValidating = true;
node1.quorumSet.threshold = 0;
let node2 = new Node("2");
node2.active = true;
node2.isValidating = true;
node2.quorumSet.threshold = 0;

let map = new Map();
map.set("0", node0);
map.set("1", node1);
map.set("2", node2);

let network = new Network([node0, node1, node2]);
let graph = network.nodesTrustGraph;
describe('canReachThreshold', () => {
    test('basic true', () => {
        let qs = new QuorumSet('a', 2, ["1", "2"]);
        expect(QuorumSetService.quorumSetCanReachThreshold(qs, graph)).toBeTruthy();
    });
    test('true with self included', () => {
        let qs = new QuorumSet('a', 3, ["0","1", "2"]);
        expect(QuorumSetService.quorumSetCanReachThreshold(qs, graph)).toBeTruthy();
    });

    test('basic false', () => {
        let qs = new QuorumSet('a', 4, ["0","1", "2"]);
        expect(QuorumSetService.quorumSetCanReachThreshold(qs, graph)).toBeFalsy();
    });

    test('innerQS', () => {
        let qs = new QuorumSet('a', 2,[], [
            new QuorumSet('b', 2, ["0", "1", "2"]),
            new QuorumSet('c', 1, ["1"])
        ] );
        expect(QuorumSetService.quorumSetCanReachThreshold(qs, graph)).toBeTruthy();
    });
    test('innerInnerQS', () => {
        let qs = new QuorumSet('a', 2,[], [
            new QuorumSet('b', 2, ["1"],
                [
                    new QuorumSet('c', 1, ["2"])
                ]
            ),
            new QuorumSet('c', 1, ["1"])
        ] );
        expect(QuorumSetService.quorumSetCanReachThreshold(qs, graph)).toBeTruthy();
    });
});

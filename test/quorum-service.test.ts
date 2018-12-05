import {QuorumSet, QuorumService, Node} from '../src';
import {_} from 'lodash';
QuorumService.disableCache();

let node1 = new Node("54.160.111.199");
node1.publicKey = "1";
let quorumSet1 = new QuorumSet();
quorumSet1.hashKey = "a";
quorumSet1.validators = ["3", "2", "1", "4"];
quorumSet1.threshold = 2;
node1.quorumSet = quorumSet1;

let node2 = new Node("54.221.140.73");
node2.publicKey = "2";
let quorumSet2 = new QuorumSet();
quorumSet2.hashKey = "b";
quorumSet2.validators = ["3", "2", "1"];
quorumSet2.threshold = 2;
node2.quorumSet = quorumSet2;

let node3 = new Node("54.204.238.171");
node3.publicKey = "3";
let quorumSet3 = new QuorumSet();
quorumSet3.hashKey = "c";
quorumSet3.validators = ["3", "2", "1"];
quorumSet3.threshold = 2;
node3.quorumSet = quorumSet3;

let node4 = new Node("45.55.22.18");
node4.publicKey = "4";
let quorumSet4 = new QuorumSet();
quorumSet4.hashKey = "c";
quorumSet4.validators = ["4", "2", "1", "3"];
quorumSet4.threshold = 3;
node4.quorumSet = quorumSet4;

let nodes = [node1, node2, node3, node4];

test('nodes', () => {
    expect(nodes.length).toEqual(4);
});

describe("getSlices", function () {
    test('1slice', function () {
        expect(QuorumService.getSlices(new QuorumSet('a', 2, ["1", "2"])))
            .toEqual([["1", "2"]])
    });
    test('mSlices', function () {
        expect(QuorumService.getSlices(new QuorumSet('a', 2, ["1", "2", "3"])))
            .toEqual([["1", "2"], ["1", "3"], ["2", "3"]])
    });
    test('innerQS', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, ["1", "2"], [
                new QuorumSet('b', 1, ["3", "4"])]
            )))
            .toEqual([
                ["1", "2"],
                ["1", "3"],
                ["1", "4"],
                ["2", "3"],
                ["2", "4"],
            ])
    });
    test('innerQS2', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, ["1", "2"], [
                new QuorumSet('b', 2, ["3", "4"])]
            )))
            .toEqual([
                ["1", "2"],
                ["1", "3", "4"],
                ["2", "3", "4"]
            ])
    });
    test('innerQS3', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, ["1", "2"], [
                    new QuorumSet('b', 2, ["3", "4"]),
                    new QuorumSet('c', 2, ["5", "6"])
                ]
            )))
            .toEqual([
                ["1", "2"],
                ["1", "3", "4"],
                ["1", "5", "6"],
                ["2", "3", "4"],
                ["2", "5", "6"],
                ["3", "4", "5", "6"]
            ])
    });
    test('innerQS4', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, [], [
                    new QuorumSet('b', 2, ["3", "4"]),
                    new QuorumSet('c', 2, ["5", "6"])
                ]
            )))
            .toEqual([
                ["3", "4", "5", "6"]
            ])
    });
    test('innerQS5', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 1, [], [
                    new QuorumSet('b', 2, ["3", "4"]),
                    new QuorumSet('c', 2, ["5", "6"])
                ]
            )))
            .toEqual([
                ["3", "4"],
                ["5", "6"]
            ])
    });
    test('innerQS6', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, ["1"], [
                    new QuorumSet('b', 2, ["3", "4"]),
                    new QuorumSet('c', 2, ["5", "6"])
                ]
            )))
            .toEqual([
                ["1", "3", "4"],
                ["1", "5", "6"],
                ["3", "4", "5", "6"]
            ])
    });
    test('innerQS7', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, ["1"], [
                    new QuorumSet('b', 2, ["3"],
                        [
                            new QuorumSet('c', 1, ["4", "5"])
                        ])
                ]
            )))
            .toEqual([
                ["1", "3", "4"],
                ["1", "3", "5"]
            ])
    });
    test('innerQS8', function () {
        expect(QuorumService.getSlices(
            new QuorumSet('a', 2, ["1"], [
                    new QuorumSet('b', 1, ["3"],
                        [
                            new QuorumSet('c', 1, ["4", "5"])
                        ])
                ]
            )))
            .toEqual([
                ["1", "3"],
                ["1", "4"],
                ["1", "5"]
            ])
    });
});

test('getAllNodeCombinations', function () {
    let nodes = [1, 2, 3];
    expect(QuorumService.getAllCombinations(nodes)).toEqual([[1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]])
});

test('setEquality', function () {
        let a = new Set();
        a.add(1);
        a.add(new Set([3,4]));
        a.add(2);

        let b = new Set();
        b.add(2);
        b.add(1);
        b.add(new Set([4,3]));
        expect(_.isEqual(a,b)).toBe(true);
    }
);
test('empty', ()=>{});
import {QuorumSet, QuorumSlicesGenerator, Node} from '../src';

let quorumSlicesGenerator = new QuorumSlicesGenerator(false);

let node1 = new Node("1");
let quorumSet1 = new QuorumSet();
quorumSet1.hashKey = "a";
node1.quorumSet = quorumSet1;

let node2 = new Node("2");
let quorumSet2 = new QuorumSet();
quorumSet2.hashKey = "b";
node2.quorumSet = quorumSet2;

let node3 = new Node("3");
let quorumSet3 = new QuorumSet();
quorumSet3.hashKey = "c";
node3.quorumSet = quorumSet3;

let node4 = new Node("4");
let quorumSet4 = new QuorumSet();
quorumSet4.hashKey = "c";
node4.quorumSet = quorumSet4;

let node5 = new Node("5");
let node6 = new Node("6");

quorumSet1.validators = [node3, node2, node1, node4];
quorumSet1.threshold = 2;

quorumSet2.validators = [node3, node2, node1];
quorumSet2.threshold = 2;

quorumSet4.validators = [node4, node2, node1, node3];
quorumSet4.threshold = 3;

quorumSet3.validators = [node3, node2, node1];
quorumSet3.threshold = 2;
let nodes = [node1, node2, node3, node4];

describe("getSlices", function () {
    test('1slice', function () {
        expect(quorumSlicesGenerator.getSlices(new QuorumSet('a', 2, [node1, node2])))
            .toEqual([["1", "2"]])
    });
    test('mSlices', function () {
        expect(quorumSlicesGenerator.getSlices(new QuorumSet('a', 2, [node1, node2, node3])))
            .toEqual([["1", "2"], ["1", "3"], ["2", "3"]])
    });
    test('innerQS', function () {
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [node1, node2], [
                new QuorumSet('b', 1, [node3, node4])]
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
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [node1, node2], [
                new QuorumSet('b', 2, [node3, node4])]
            )))
            .toEqual([
                ["1", "2"],
                ["1", "3", "4"],
                ["2", "3", "4"]
            ])
    });
    test('innerQS3', function () {
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [node1, node2], [
                    new QuorumSet('b', 2, [node3, node4]),
                    new QuorumSet('c', 2, [node5, node6])
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
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [], [
                    new QuorumSet('b', 2, [node3, node4]),
                    new QuorumSet('c', 2, [node5, node6])
                ]
            )))
            .toEqual([
                ["3", "4", "5", "6"]
            ])
    });
    test('innerQS5', function () {
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 1, [], [
                    new QuorumSet('b', 2, [node3, node4]),
                    new QuorumSet('c', 2, [node5, node6])
                ]
            )))
            .toEqual([
                ["3", "4"],
                ["5", "6"]
            ])
    });
    test('innerQS6', function () {
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [node1], [
                    new QuorumSet('b', 2, [node3, node4]),
                    new QuorumSet('c', 2, [node5, node6])
                ]
            )))
            .toEqual([
                ["1", "3", "4"],
                ["1", "5", "6"],
                ["3", "4", "5", "6"]
            ])
    });
    test('innerQS7', function () {
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [node1], [
                    new QuorumSet('b', 2, [node3],
                        [
                            new QuorumSet('c', 1, [node4, node5])
                        ])
                ]
            )))
            .toEqual([
                ["1", "3", "4"],
                ["1", "3", "5"]
            ])
    });
    test('innerQS8', function () {
        expect(quorumSlicesGenerator.getSlices(
            new QuorumSet('a', 2, [node1], [
                    new QuorumSet('b', 1, [node3],
                        [
                            new QuorumSet('c', 1, [node4, node5])
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
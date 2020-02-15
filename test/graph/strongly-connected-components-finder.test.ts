import {Node} from '../../src';
import {StronglyConnectedComponentsFinder} from "../../src/graph/strongly-connected-components-finder";
import {DirectedGraphManager} from "../../src";
import * as _ from 'lodash';
import {DirectedGraph, Vertex} from "../../src";

//https://www.youtube.com/watch?v=TyWtx7q2D7Y

let node1 = new Node('localhost', 20, '1');
node1.active = true;
node1.isValidating = true;
let node2 = new Node('localhost', 20, '2');
node2.active = true;
node2.isValidating = true;
let node3 = new Node('localhost', 20, '3');
node3.active = true;
node3.isValidating = true;
let node4 = new Node('localhost', 20, '4');
node4.active = true;
node4.isValidating = true;
let node5 = new Node('localhost', 20, '5');
node5.active = true;
node5.isValidating = true;
let node6 = new Node('localhost', 20, '6');
node6.active = true;
node6.isValidating = true;
let node7 = new Node('localhost', 20, '7');
node7.active = true;
node7.isValidating = true;
let node8 = new Node('localhost', 20, '8');
node8.active = true;
node8.isValidating = true;

//another strongly connected component without outgoing _edges, that is not the transitive quorumset
let node9 = new Node('localhost', 20, '9');
node9.active = true;
node9.isValidating = true;
let node10 = new Node('localhost', 20, '10');
node10.active = true;
node10.isValidating = true;

node1.quorumSet.threshold = 1;
node2.quorumSet.threshold = 1;
node3.quorumSet.threshold = 1;
node4.quorumSet.threshold = 1;
node5.quorumSet.threshold = 1;
node6.quorumSet.threshold = 1;
node7.quorumSet.threshold = 1;
node8.quorumSet.threshold = 1;
node9.quorumSet.threshold = 1;
node10.quorumSet.threshold = 1;

node1.quorumSet.validators.push(node2.publicKey!);
node1.quorumSet.validators.push(node5.publicKey!);
node2.quorumSet.validators.push(node6.publicKey!);
node3.quorumSet.validators.push(node2.publicKey!);
node3.quorumSet.validators.push(node4.publicKey!);
node3.quorumSet.validators.push(node7.publicKey!);
node4.quorumSet.validators.push(node7.publicKey!);
node5.quorumSet.validators.push(node1.publicKey!);
node5.quorumSet.validators.push(node6.publicKey!);
node6.quorumSet.validators.push(node3.publicKey!);
node6.quorumSet.validators.push(node7.publicKey!);
node7.quorumSet.validators.push(node8.publicKey!);
node8.quorumSet.validators.push(node4.publicKey!);

node9.quorumSet.validators.push(node10.publicKey!);
node10.quorumSet.validators.push(node9.publicKey!);

let directedGraphManager = new DirectedGraphManager();


test('findTarjan', function () {
    let graph = directedGraphManager.buildGraphFromNodes([node7, node1, node2, node3, node4, node5, node6, node8, node9, node10]);
    let dfs = new StronglyConnectedComponentsFinder();
    let results = dfs.findTarjan(graph);

    expect(results.length).toEqual(4);

    expect(results.find(scp => _.isEqual(scp, new Set(['2','3','6'])))).toBeTruthy();

    expect(results.find(scp => _.isEqual(scp, new Set(['4','7','8'])))).toBeTruthy();

    expect(results.find(scp => _.isEqual(scp, new Set(['1','5'])))).toBeTruthy();

    expect(results.find(scp => _.isEqual(scp, new Set(['9','10'])))).toBeTruthy();
});

test('findTarjanFailingNodes', function () {

    node7.isValidating = false;
    node8.isValidating = false;
    let graph = directedGraphManager.buildGraphFromNodes([node7, node1, node2, node3, node4, node5, node6, node8, node9, node10]);
    let dfs = new StronglyConnectedComponentsFinder();
    let results = dfs.findTarjan(graph);

    expect(results.length).toEqual(3);
    expect(results.find(scp => _.isEqual(scp, new Set(['2','3','6'])))).toBeTruthy();

    expect(results.find(scp => _.isEqual(scp, new Set(['4','7','8'])))).toBeFalsy();

    expect(results.find(scp => _.isEqual(scp, new Set(['1','5'])))).toBeTruthy();

    expect(results.find(scp => _.isEqual(scp, new Set(['9','10'])))).toBeTruthy();
});
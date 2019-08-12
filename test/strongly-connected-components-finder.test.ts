import {Node, Network} from '../src';
import {StronglyConnectedComponentsFinder} from "../src/strongly-connected-components-finder";
import * as _ from 'lodash';

//https://www.youtube.com/watch?v=TyWtx7q2D7Y
let node1 = new Node('localhost', 20, '1');
let node2 = new Node('localhost', 20, '2');
let node3 = new Node('localhost', 20, '3');
let node4 = new Node('localhost', 20, '4');
let node5 = new Node('localhost', 20, '5');
let node6 = new Node('localhost', 20, '6');
let node7 = new Node('localhost', 20, '7');
let node8 = new Node('localhost', 20, '8');

//another strongly connected component without outgoing edges, that is not the transitive quorumset
let node9 = new Node('localhost', 20, '9');
let node10 = new Node('localhost', 20, '10');
node4.index = 1;

node1.quorumSet.validators.push(node2.publicKey);
node1.quorumSet.validators.push(node5.publicKey);
node2.quorumSet.validators.push(node6.publicKey);
node3.quorumSet.validators.push(node2.publicKey);
node3.quorumSet.validators.push(node4.publicKey);
node3.quorumSet.validators.push(node7.publicKey);
node4.quorumSet.validators.push(node7.publicKey);
node5.quorumSet.validators.push(node1.publicKey);
node5.quorumSet.validators.push(node6.publicKey);
node6.quorumSet.validators.push(node3.publicKey);
node6.quorumSet.validators.push(node7.publicKey);
node7.quorumSet.validators.push(node8.publicKey);
node8.quorumSet.validators.push(node4.publicKey);

node9.quorumSet.validators.push(node10.publicKey);
node10.quorumSet.validators.push(node9.publicKey);

let network = new Network([node7, node1, node2, node3, node4, node5, node6, node8, node9, node10]);

test('findTarjan', function () {
    let dfs = new StronglyConnectedComponentsFinder();
    let results = dfs.findTarjan(network);

    expect(results.length).toEqual(4);
    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['2','3','6'])))).toBeTruthy();
    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['2','3','6']))).isTransitiveQuorumSet).toBeFalsy();

    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['4','7','8'])))).toBeTruthy();
    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['4','7','8']))).isTransitiveQuorumSet).toBeTruthy();

    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['1','5'])))).toBeTruthy();
    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['1','5']))).isTransitiveQuorumSet).toBeFalsy();

    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['9','10'])))).toBeTruthy();
    expect(results.find(scp => _.isEqual(scp.nodes, new Set(['9','10']))).isTransitiveQuorumSet).toBeFalsy();
});
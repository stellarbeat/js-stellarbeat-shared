import {ClusterService, QuorumSet, QuorumService, Node} from '../src';
import * as _ from 'lodash';

let node1 = new Node('localhost', 20, 'a');
node1.active = true;
let node2 = new Node('localhost', 20, 'b');
node2.active = true;
let node3 = new Node('localhost', 20, 'c');
node3.active = true;
let node4 = new Node('localhost', 20, 'd');
node4.active = false;

node1.quorumSet.validators.push(node2.publicKey);
node1.quorumSet.validators.push(node4.publicKey);
node2.quorumSet.validators.push(node1.publicKey);
node3.quorumSet.validators.push(node1.publicKey);
node4.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['a']));

test('getCluster', function () {
    let clusterService = new ClusterService([node1, node2, node3, node4]);
    expect(clusterService.getCluster(node1)).toEqual(['a', 'b']);
});

test('getAllClusters', function () {
    let clusterService = new ClusterService([node1, node2, node3, node4]);
    expect(clusterService.getAllClusters()).toEqual([new Set(['a', 'b'])]);
});
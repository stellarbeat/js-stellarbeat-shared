import {ClusterService, QuorumSet, QuorumService, Node, Network} from '../src';
import {StronglyConnectedComponentsFinder} from "../src/strongly-connected-components-finder";

//https://www.youtube.com/watch?v=TyWtx7q2D7Y
let node1 = new Node('localhost', 20, '1');
let node2 = new Node('localhost', 20, '2');
let node3 = new Node('localhost', 20, '3');
let node4 = new Node('localhost', 20, '4');
let node5 = new Node('localhost', 20, '5');
let node6 = new Node('localhost', 20, '6');
let node7 = new Node('localhost', 20, '7');
let node8 = new Node('localhost', 20, '8');

//a->b a->d //strongly connected component
//b->a b->d //strongly connected component
//d->a //strongly connected component
//c->a
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

let network = new Network([node7, node1, node2, node3, node4, node5, node6, node8]);

test('findTarjan', function () {
    let dfs = new StronglyConnectedComponentsFinder();
    dfs.findTarjan(network);
});
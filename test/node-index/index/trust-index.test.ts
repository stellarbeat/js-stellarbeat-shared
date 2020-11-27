import {Network, Node, TrustIndex} from "../../../src";

let node1 = new Node('a');
node1.quorumSet.validators.push('c');
node1.quorumSet.validators.push('unknown');//should be filtered out

node1.active = true;
let node2 = new Node('b');
node2.quorumSet.validators.push('a');
node2.active = true;
let node3 = new Node('c');
node3.quorumSet.validators.push('a');
node3.active = true;
let node4 = new Node('d');
node4.quorumSet.validators.push('a');
node4.active = true;
let node5 = new Node('e');
node5.versionStr = "v11.0.0rc1";
node5.quorumSet.validators.push('b');
node5.active = true;
let node6 = new Node('f');
node6.versionStr = "v9.3.0-44-g80ce920";
node6.active = true;
let nodes = [node1, node2, node3, node4, node5, node6];

let trustIndex = new TrustIndex(new Network(nodes));
test('get', () => {
    expect(trustIndex.get(node1)).toEqual(3/4);
});
import {Node, Network, VersionIndex} from "../../../src";

let node1 = new Node('localhost', 20, 'a');
node1.versionStr = "stellar-core 10.9.0 (236f831521b6724c0ae63906416faa997ef27e19)";
let node2 = new Node('localhost', 20, 'b');
node2.versionStr = "stellar-core 10.3.0 (de204d718a4603fba2c36d79a7cccad415dd1597)";
let node3 = new Node('localhost', 20, 'c');
node3.versionStr = undefined;
let node4 = new Node('localhost', 20, 'd');
node4.versionStr = "v10.3.0";
let node5 = new Node('localhost', 20, 'e');
node5.versionStr = "v11.0.0rc1";
let node6 = new Node('localhost', 20, 'f');
node6.versionStr = "v9.3.0-44-g80ce920";

let network = new Network([node1, node2, node3, node4, node5, node6]);

let versionIndex = new VersionIndex(network);

test('getHighestStellarCoreVersion', () => {
    expect(versionIndex.getHighestStellarCoreVersion(network.nodes)).toEqual("10.9.0");
});

test('get', () => {
    expect(versionIndex.get(node1)).toEqual(1);
    expect(versionIndex.get(node2)).toEqual(0.6);
    expect(versionIndex.get(node3)).toEqual(0);
    expect(versionIndex.get(node4)).toEqual(0.6);
    expect(versionIndex.get(node5)).toEqual(1); //todo what about release candidates?
    expect(versionIndex.get(node6)).toEqual(0.3); //todo what about release candidates?


});
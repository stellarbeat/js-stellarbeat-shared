import {Node, Network, VersionIndex} from "../../../src";

let node1 = new Node('a');
node1.versionStr = "stellar-core 10.9.0 (236f831521b6724c0ae63906416faa997ef27e19)";
let node2 = new Node('b');
node2.versionStr = "stellar-core 10.3.0 (de204d718a4603fba2c36d79a7cccad415dd1597)";
let node3 = new Node('c');
node3.versionStr = undefined;
let node4 = new Node('d');
node4.versionStr = "v10.3.0";
let node5 = new Node('e');
node5.versionStr = "v11.0.0rc1";
let node6 = new Node('f');
node6.versionStr = "v9.3.0-44-g80ce920";
let node7 = new Node('g');
node7.versionStr = "796f08a5-dirty"; //invalid version
let node8 = new Node('i');
node8.versionStr = "stellar-core 17.0.0.rc1 (a6c4bf72984711e3da4ade849dfaec5ce1f8d489)";
let node9 = new Node('i');
node9.versionStr = "stellar-core 17.0.0-rc1 (a6c4bf72984711e3da4ade849dfaec5ce1f8d489)";

let nodes =[node1, node2, node3, node4, node5, node6, node7, node8];

let versionIndex = new VersionIndex(nodes);

test('getHighestStellarCoreVersion', () => {
    expect(versionIndex.getHighestStellarCoreVersion(nodes)).toEqual("10.9.0");
});

test('get', () => {
    expect(versionIndex.get(node1)).toEqual(1);
    expect(versionIndex.get(node2)).toEqual(0.6);
    expect(versionIndex.get(node3)).toEqual(0);
    expect(versionIndex.get(node4)).toEqual(0.6);
    expect(versionIndex.get(node5)).toEqual(1); //todo what about release candidates?
    expect(versionIndex.get(node6)).toEqual(0.3); //todo what about release candidates?
    expect(versionIndex.get(node7)).toEqual(0);

});
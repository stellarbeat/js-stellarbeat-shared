import {ActiveIndex, ValidatingIndex, TypeIndex, NodeIndex, Node, Network, VersionIndex, TrustIndex, AgeIndex} from '../../src';

jest.mock('./../../src/node-index/index/active-index');
jest.mock('./../../src/node-index/index/validating-index');
jest.mock('./../../src/node-index/index/type-index');
jest.mock('./../../src/node-index/index/version-index');
jest.mock('./../../src/node-index/index/trust-index');
jest.mock('./../../src/node-index/index/age-index');

let node1 = new Node('localhost', 20, 'a');
node1.versionStr = "1.0.0";
let node2 = new Node('localhost', 20, 'b');
node2.versionStr = "2.0.0rc1";
let node3 = new Node('localhost', 20, 'c');
node3.versionStr = "3.0.0 (1fc018b4f52e8c7e716b023ccf30600af5b4f66d)";
let node4 = new Node('localhost', 20, 'c');
node4.versionStr = "2.0.0";
let node5 = new Node('localhost', 20, 'c');
node5.versionStr = "stellar-core 2.0.0";
let node6 = new Node('localhost', 20, 'c');
node6.versionStr = "v2.0.0";

let network = new Network([node1, node2, node3, node4, node5, node6]);

test('getNodeIndex', () => {
    (ActiveIndex.get as any).mockImplementation(() => 1);
    (ValidatingIndex.get as any).mockImplementation(() => 0);

    (AgeIndex.get as any).mockImplementation(() => 1);

    (TypeIndex.get as any).mockImplementation(() => 0.101);
    (TrustIndex as any).mockImplementation(() => {
        return {
            get: () => 0.5
        }
    });
    (VersionIndex as any).mockImplementation(() => {
        return {
            get: () => 1
        };
    });

    let nodeIndex = new NodeIndex(network);
    expect(nodeIndex.getIndex(node1)).toEqual(0.6);
});
import {
    TransitiveQuorumSetTree,
    TransitiveQuorumSetTreeVertex,
    Node,
    QuorumSet,
    TransitiveQuorumSetTreeRoot
} from '../../src';

let root = new TransitiveQuorumSetTreeRoot('root', 'my root', true);
let tree = new TransitiveQuorumSetTree(root);

test('tree', () => {
    tree.addVertex(new TransitiveQuorumSetTreeVertex('leaf1', 'leaf1', true, root));
    tree.addVertex(new TransitiveQuorumSetTreeVertex('leaf2', 'leaf2', true, root));
    expect(tree.vertices.length).toEqual(
        3
    );
    expect(tree.edges.length).toEqual(2);
});

test('parent vertex not found', () => {
    let fakeParent = new TransitiveQuorumSetTreeVertex('leaf2', 'leaf2', true, root);
    expect(() => tree.addVertex(
        new TransitiveQuorumSetTreeVertex('leaf2', 'leaf2', true, fakeParent)
    )).toThrowError("Parent vertex not found in tree: Transitive Quorum Set Tree Vertex (publicKey: leaf2, label: leaf2, isRoot: false,  isValidating: true, distance: 1)");
});
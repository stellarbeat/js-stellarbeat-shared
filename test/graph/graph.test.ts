import {Node, QuorumSet} from '../../src';
import {DirectedGraphManager} from "../../src";

let nodeA = new Node('localhost', 20, 'a');
nodeA.active = true;
nodeA.isValidating = true;
let nodeB = new Node('localhost', 20, 'b');
nodeB.active = true;
nodeB.isValidating = true;
let nodeC = new Node('localhost', 20, 'c');
nodeC.active = true;
nodeC.isValidating = true;
let nodeD = new Node('localhost', 20, 'd');
nodeD.active = true;
nodeD.isValidating = true;
let nodeE = new Node('localhost', 20, 'e');
nodeE.active = true;
nodeE.isValidating = true;

nodeA.quorumSet.validators.push(nodeB.publicKey);
nodeA.quorumSet.threshold = 1;
nodeB.quorumSet.validators.push(nodeA.publicKey);
nodeB.quorumSet.threshold = 1;
nodeC.quorumSet.validators.push(nodeA.publicKey);
nodeC.quorumSet.threshold = 1;
nodeD.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['a']));
nodeD.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['e']));
nodeD.quorumSet.threshold = 1;
nodeE.quorumSet.threshold = 0;

let directedGraphManager = new DirectedGraphManager();

test('buildGraphFromNodes', () => {
    let graph = directedGraphManager.buildGraphFromNodes([nodeA, nodeB, nodeC, nodeD, nodeE]);
    expect(graph.vertices.size).toEqual(5);
    expect(graph.edges.size).toEqual(5);
    expect(graph.getParents(graph.getVertex('a')!).size).toEqual(3);
    expect(graph.getChildren(graph.getVertex('d')!).size).toEqual(2);
    expect(graph.networkTransitiveQuorumSet).toEqual(new Set(['b', 'a']));

    expect(Array.from(graph.edges).filter(
        edge => graph.isEdgePartOfStronglyConnectedComponent(edge)).length
    ).toEqual(2);
});

test('updateGraphWithNoTransitiveQuorumSet', () => {
    nodeA.active = false;
    let graph = directedGraphManager.buildGraphFromNodes([nodeA, nodeB, nodeC, nodeD, nodeE]);
    expect(Array.from(graph.vertices.values()).filter(vertex => vertex.isValidating).length).toEqual(2);
    expect(Array.from(graph.edges.values()).filter(edge => edge.isActive).length).toEqual(1);
    expect(graph.hasNetworkTransitiveQuorumSet()).toEqual(false);
    expect(graph.networkTransitiveQuorumSet.size).toEqual(0);
    nodeA.active = true;
});

test('updateGraphWithFailingVertices', () => {
    let graph = directedGraphManager.buildGraphFromNodes([nodeA, nodeB, nodeC, nodeD, nodeE]);
    graph.updateGraphWithFailingVertices(['a']);
    expect(Array.from(graph.vertices.values()).filter(vertex => vertex.isValidating).length).toEqual(2);
    expect(Array.from(graph.edges.values()).filter(edge => edge.isActive).length).toEqual(1);
    expect(graph.hasNetworkTransitiveQuorumSet()).toEqual(false);
    expect(graph.networkTransitiveQuorumSet.size).toEqual(0);
});

test('transitiveQuorumSetTree', () => {
    let graph = directedGraphManager.buildGraphFromNodes([nodeA, nodeB, nodeC, nodeD, nodeE]);
    let vertex = graph.getVertex(nodeD.publicKey);
    let tree = graph.getTransitiveQuorumSetTree(vertex);
    expect(tree.vertices.length).toEqual(5);
    expect(tree.root.distance).toEqual(0);
    expect(tree.getChildren(tree.root).length).toEqual(2);
    expect(tree.getChildren(tree.root).map(child => child.distance) ).toEqual([1,1]);
    expect(tree.getChildren(tree.root).map(child => child.isRoot) ).toEqual([false,false]);
    expect(tree.getChildren(tree.root).map(child => child.isValidating) ).toEqual([true,true]);
    expect(tree.edges.length).toEqual(4);
});
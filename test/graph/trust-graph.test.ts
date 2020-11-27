import {Network, Node, QuorumSet} from '../../src';
import {TrustGraphBuilder} from "../../src";

let nodeA = new Node('a');
nodeA.active = true;
nodeA.isValidating = true;
let nodeB = new Node('b');
nodeB.active = true;
nodeB.isValidating = true;
let nodeC = new Node('c');
nodeC.active = true;
nodeC.isValidating = true;
let nodeD = new Node('d');
nodeD.active = true;
nodeD.isValidating = true;
let nodeE = new Node('e');
nodeE.active = true;
nodeE.isValidating = true;

nodeA.quorumSet.validators.push('b');
nodeA.quorumSet.threshold = 1;
nodeB.quorumSet.validators.push('a');
nodeB.quorumSet.threshold = 1;
nodeC.quorumSet.validators.push('a');
nodeC.quorumSet.threshold = 1;
nodeD.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['a']));
nodeD.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['e']));
nodeD.quorumSet.threshold = 1;
nodeE.quorumSet.threshold = 0;

let trustGraphBuilder = new TrustGraphBuilder();

test('buildGraphFromNodes', () => {
    let network = new Network([nodeA, nodeB, nodeC, nodeD, nodeE]);
    let graph = network.nodesTrustGraph;
    expect(graph.vertices.size).toEqual(5);
    expect(graph.edges.size).toEqual(5);
    expect(graph.getParents(graph.getVertex('a')!).size).toEqual(3);
    expect(graph.getChildren(graph.getVertex('d')!).size).toEqual(2);
    expect(graph.networkTransitiveQuorumSet).toEqual(new Set(['a', 'b']));

    expect(Array.from(graph.edges).filter(
        edge => graph.isEdgePartOfStronglyConnectedComponent(edge)).length
    ).toEqual(2);
});

test('updateGraphWithFailingVertices', () => {
    let nodes = [nodeA, nodeB, nodeC, nodeD, nodeE];
    let network = new Network(nodes);
    let graph = trustGraphBuilder.buildGraphFromNodes(network);
    let map = new Map();
    nodes.forEach(node => map.set(node.publicKey, node));
    trustGraphBuilder.updateNodesGraphWithFailingVertices(network, graph, ['a']);
    expect(Array.from(graph.vertices.values()).filter(vertex => !vertex.failing).length).toEqual(2);
    expect(Array.from(graph.edges.values()).filter(edge => !edge.failing).length).toEqual(1);
    expect(graph.hasNetworkTransitiveQuorumSet()).toEqual(true);
    expect(graph.networkTransitiveQuorumSet.size).toEqual(2);
});

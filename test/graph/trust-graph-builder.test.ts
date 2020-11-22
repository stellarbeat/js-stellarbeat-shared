import {Node, Organization, QuorumSet} from '../../src';
import {TrustGraphBuilder} from "../../src";

let organizationA = new Organization('A', 'A');
let organizationB = new Organization('B', 'B');

let nodeA = new Node('a');
nodeA.active = true;
nodeA.isValidating = true;
nodeA.organization = organizationA;
let nodeAA = new Node('aa');
nodeAA.active = true;
nodeAA.isValidating = true;
nodeAA.organization = organizationA;
let nodeB = new Node('b');
nodeB.active = true;
nodeB.isValidating = true;
nodeB.organization = organizationB;
let nodeBB = new Node('bb');
nodeBB.active = true;
nodeBB.isValidating = true;
nodeBB.organization = organizationB;

nodeA.quorumSet.validators.push(nodeB);
nodeA.quorumSet.threshold = 1;
nodeAA.quorumSet.validators.push(nodeBB);
nodeAA.quorumSet.threshold = 1;
nodeB.quorumSet.validators.push(nodeA);
nodeB.quorumSet.threshold = 1;
nodeBB.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, [nodeAA]));
nodeBB.quorumSet.threshold = 1;

organizationA.validators.push(...[nodeA, nodeAA]);
organizationB.validators.push(...[nodeB, nodeBB]);

let trustGraphBuilder = new TrustGraphBuilder();

test('buildGraphs', () => {
    let nodesGraph = trustGraphBuilder.buildGraphFromNodes([nodeA, nodeAA, nodeB, nodeBB]);
    let organizationsGraph = trustGraphBuilder.buildGraphFromOrganizations([organizationA, organizationB]);

    expect(nodesGraph.vertices.size).toEqual(4);
    expect(nodesGraph.edges.size).toEqual(4);
    expect(Array.from(nodesGraph.vertices.values()).filter(vertex => vertex.key === 'a')).toHaveLength(1);
    expect(Array.from(nodesGraph.vertices.values()).filter(vertex => vertex.key === 'b')).toHaveLength(1);
    expect(Array.from(nodesGraph.vertices.values()).filter(vertex => vertex.key === 'aa')).toHaveLength(1);
    expect(Array.from(nodesGraph.vertices.values()).filter(vertex => vertex.key === 'bb')).toHaveLength(1);

    expect(organizationsGraph.vertices.size).toEqual(2);
    expect(Array.from(organizationsGraph.vertices.values()).filter(vertex => vertex.key === 'A')).toHaveLength(1);
    expect(Array.from(organizationsGraph.vertices.values()).filter(vertex => vertex.key === 'B')).toHaveLength(1);
    expect(organizationsGraph.edges.size).toEqual(2);
    expect(Array.from(organizationsGraph.edges).filter(edge => edge.parent.key === 'A' && edge.child.key === 'B')).toHaveLength(1);
    expect(Array.from(organizationsGraph.edges).filter(edge => edge.parent.key === 'B' && edge.child.key === 'A')).toHaveLength(1);
});

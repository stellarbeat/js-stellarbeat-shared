import {Node, Network, QuorumSet, Organization} from '../src';

let node1 = new Node('a');
node1.active = true;
node1.isValidating = true;
node1.quorumSet.threshold = 1;
let node2 = new Node('b');
node1.quorumSet.validators.push('b');

node2.quorumSet.threshold = 1;
node2.quorumSet.validators.push('a');
node2.active = true;
node2.isValidating = true;
let node3 = new Node('c');
let node4 = new Node('d');
let node5 = new Node('e');
node3.quorumSet.validators.push('a');
node3.quorumSet.threshold = 1;
node2.quorumSet.innerQuorumSets.push(new QuorumSet('failingqset', 5, ['c']));
node4.quorumSet.threshold = 1;
node4.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['a']));
node4.quorumSet.innerQuorumSets.push(new QuorumSet('hashkey', 1, ['e']));

let organization = new Organization('orgId', 'org');
organization.validators = ['a', 'b', 'c', 'd'];
node1.organizationId = 'orgId';
node2.organizationId = 'orgId';
node3.organizationId = 'orgId';
node4.organizationId = 'orgId';
organization.subQuorumAvailable = true;
organization.subQuorumAvailable = true;
organization.subQuorumAvailable = true;
organization.subQuorumAvailable = true;
let otherOrganization = new Organization('otherId', 'otherOrg');
otherOrganization.validators = ['e'];
node5.organizationId = 'otherId';

let network:Network;

beforeEach(() => {
    network = new Network([node1, node2, node3, node4, node5], [organization, otherOrganization]);
} )
test('isOrganizationBlocked', () => {
    expect(network.isOrganizationBlocked(organization)).toBeFalsy();
    organization.subQuorumAvailable = false;
    expect(network.isOrganizationBlocked(organization)).toBeFalsy();
    expect(network.isOrganizationFailing(organization)).toBeTruthy();
    network.blockedNodes.add(node1.publicKey);
    network.blockedNodes.add(node2.publicKey);
    expect(network.isOrganizationBlocked(organization)).toBeFalsy();
    network.blockedNodes.add(node3.publicKey);
    expect(network.isOrganizationBlocked(organization)).toBeTruthy();
    organization.subQuorumAvailable = true;//needs refactoring
})
test('getTrustingNodes', () => {
    expect(network.getTrustingNodes(node1)).toEqual([node2, node3, node4]);
});

test('isQuorumSetFailing', () => {
    expect(network.isQuorumSetFailing(node2)).toBeFalsy();
    expect(network.isQuorumSetFailing(node2, node2.quorumSet.innerQuorumSets[0])).toBeTruthy();
    expect(network.isQuorumSetFailing(node3)).toBeFalsy();
});

test('isNodeFailing', () => {
    expect(network.isNodeFailing(node1)).toBeFalsy();
    expect(network.isNodeFailing(node2)).toBeFalsy();
    expect(network.isNodeFailing(node3)).toBeTruthy();
    expect(network.isNodeFailing(node4)).toBeTruthy();
    expect(network.isNodeFailing(new Node('unknown'))).toBeTruthy();
});

test ('isOrganizationFailing', () => {
    expect(organization.subQuorumAvailable).toBeTruthy();
    node1.isValidating = false;
    network.modifyNetwork();
    expect(organization.subQuorumAvailable).toBeFalsy();
    node1.isValidating = true;//needs refactoring

})
test('getTrustedOrganizationsByOrganization', () => {
    expect(network.getTrustedOrganizationsByOrganization(organization)).toEqual([otherOrganization]);
})
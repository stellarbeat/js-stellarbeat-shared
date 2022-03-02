import { Node, Network, QuorumSet, Organization } from '../src';

const node1 = new Node('a');
node1.active = true;
node1.isValidating = true;
node1.quorumSet.threshold = 1;
const node2 = new Node('b');
node1.quorumSet.validators.push('b');

node2.quorumSet.threshold = 1;
node2.quorumSet.validators.push('a');
node2.active = true;
node2.isValidating = true;
const node3 = new Node('c');
const node4 = new Node('d');
const node5 = new Node('e');
node3.quorumSet.validators.push('a');
node3.quorumSet.threshold = 1;
node2.quorumSet.innerQuorumSets.push(new QuorumSet(5, ['c']));
node4.quorumSet.threshold = 1;
node4.quorumSet.innerQuorumSets.push(new QuorumSet(1, ['a']));
node4.quorumSet.innerQuorumSets.push(new QuorumSet(1, ['e']));

const organization = new Organization('orgId', 'org');
organization.validators = ['a', 'b', 'c', 'd'];
node1.organizationId = 'orgId';
node2.organizationId = 'orgId';
node3.organizationId = 'orgId';
node4.organizationId = 'orgId';
organization.subQuorumAvailable = true;
organization.subQuorumAvailable = true;
organization.subQuorumAvailable = true;
organization.subQuorumAvailable = true;
const otherOrganization = new Organization('otherId', 'otherOrg');
otherOrganization.validators = ['e'];
node5.organizationId = 'otherId';

let network: Network;

beforeEach(() => {
	network = new Network(
		[node1, node2, node3, node4, node5],
		[organization, otherOrganization]
	);
});
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
	organization.subQuorumAvailable = true; //needs refactoring
});
test('getTrustingNodes', () => {
	expect(network.getTrustingNodes(node1)).toEqual([node2, node3, node4]);
});

test('isQuorumSetFailing', () => {
	expect(network.isQuorumSetBlocked(node2)).toBeFalsy();
	expect(
		network.isQuorumSetBlocked(node2, node2.quorumSet.innerQuorumSets[0])
	).toBeTruthy();
	expect(network.isQuorumSetBlocked(node3)).toBeFalsy();
});

test('isNodeFailing', () => {
	expect(network.isNodeFailing(node1)).toBeFalsy();
	expect(network.isNodeFailing(node2)).toBeFalsy();
	expect(network.isNodeFailing(node3)).toBeTruthy();
	expect(network.isNodeFailing(node4)).toBeTruthy();
	expect(network.isNodeFailing(new Node('unknown'))).toBeTruthy();
});

test('isOrganizationFailing', () => {
	expect(organization.subQuorumAvailable).toBeTruthy();
	node1.isValidating = false;
	network.recalculateNetwork();
	expect(organization.subQuorumAvailable).toBeFalsy();
	node1.isValidating = true; //needs refactoring
});
test('getTrustedOrganizationsByOrganization', () => {
	expect(network.getTrustedOrganizationsByOrganization(organization)).toEqual([
		otherOrganization
	]);
});

it('should detect blocked nodes on hydration and after recalculation', function () {
	const nodeA = new Node('A');
	nodeA.active = true;
	nodeA.isValidating = false;
	nodeA.participatingInSCP = true;

	const nodeB = new Node('B');
	nodeB.active = true;
	nodeB.isValidating = false;
	nodeB.participatingInSCP = false;

	nodeA.quorumSet.threshold = 1;
	nodeA.quorumSet.validators.push('B');

	nodeB.quorumSet.threshold = 1;
	nodeB.quorumSet.validators.push('A');

	const network = new Network([nodeB, nodeA]);
	expect(network.blockedNodes).toEqual(new Set([nodeA.publicKey]));

	network.recalculateNetwork();
	expect(network.blockedNodes).toEqual(new Set([nodeA.publicKey]));

	nodeA.isValidating = true;
	nodeB.isValidating = true;
	network.recalculateNetwork();
	expect(network.blockedNodes).toEqual(new Set([]));

	nodeA.isValidating = false;
	nodeA.participatingInSCP = false;
	nodeB.isValidating = true;
	network.recalculateNetwork();
	expect(network.blockedNodes).toEqual(new Set([nodeB.publicKey]));
});

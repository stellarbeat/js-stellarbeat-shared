import {
	ActiveIndex,
	ValidatingIndex,
	TypeIndex,
	NodeIndex,
	Node,
	Network,
	VersionIndex,
	TrustIndex,
	AgeIndex
} from '../../src';
import Mock = jest.Mock;

jest.mock('./../../src/node-index/index/active-index');
jest.mock('./../../src/node-index/index/validating-index');
jest.mock('./../../src/node-index/index/type-index');
jest.mock('./../../src/node-index/index/version-index');
jest.mock('./../../src/node-index/index/trust-index');
jest.mock('./../../src/node-index/index/age-index');

const node1 = new Node('a');
node1.versionStr = '1.0.0';
const node2 = new Node('b');
node2.versionStr = '2.0.0rc1';
const node3 = new Node('c');
node3.versionStr = '3.0.0 (1fc018b4f52e8c7e716b023ccf30600af5b4f66d)';
const node4 = new Node('c');
node4.versionStr = '2.0.0';
const node5 = new Node('c');
node5.versionStr = 'stellar-core 2.0.0';
const node6 = new Node('c');
node6.versionStr = 'v2.0.0';

const nodes = [node1, node2, node3, node4, node5, node6];

test('getNodeIndex', () => {
	(ActiveIndex.get as Mock).mockImplementation(() => 1);
	(ValidatingIndex.get as Mock).mockImplementation(() => 0);

	(AgeIndex.get as Mock).mockImplementation(() => 1);

	(TypeIndex.get as Mock).mockImplementation(() => 0.101);
	(TrustIndex as Mock).mockImplementation(() => {
		return {
			get: () => 0.5
		};
	});
	(VersionIndex as Mock).mockImplementation(() => {
		return {
			get: () => 1
		};
	});

	const nodeIndex = new NodeIndex(new Network(nodes));
	expect(nodeIndex.getIndex(node1)).toEqual(0.6);
});

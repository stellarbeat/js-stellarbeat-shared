import { Node, Organization } from '../src';

const node = new Node(
	'GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK'
);
node.name = 'SDF validator 2';
node.host = 'core-live-b.stellar.org';
node.ledgerVersion = null;
node.networkId = null;
node.overlayMinVersion = null;
node.overlayVersion = null;
node.geoData.countryName = 'United States';
node.geoData.countryCode = 'US';
node.geoData.latitude = 39.0853;
node.geoData.longitude = -77.6452;
node.versionStr = 'v10.0.0';
node.dateDiscovered = new Date('2018-04-28 14:39:01');
node.dateUpdated = new Date('2018-10-12 11:17:39');
node.quorumSetHashKey = 'dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=';
node.quorumSet.threshold = 2;
const trustedNode = new Node(
	'GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ'
);
trustedNode.unknown = true;
trustedNode.dateDiscovered = new Date('2018-04-28 14:39:01');
trustedNode.dateUpdated = new Date('2018-10-12 11:17:39');
node.quorumSet.validators = [
	'GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ'
];
node.quorumSet.innerQuorumSets = [];
node.active = true;
node.overLoaded = false;
node.isFullValidator = true;
node.homeDomain = 'my-domain';
node.isValidating = false;
const organization = new Organization('123', 'org');
node.organizationId = organization.id;
node.alias = 'my-alias';
node.historyUrl = 'https://my-history.net';
node.isp = 'amazon.com Inc.';
node.statistics.has30DayStats = true;
node.statistics.has24HourStats = true;
node.historyArchiveHasError = true;

const nodeObject: Record<string, unknown> = {};
nodeObject.name = 'SDF validator 2';
nodeObject.host = 'core-live-b.stellar.org';
nodeObject.index = 0;
nodeObject.ip = '127.0.0.1';
nodeObject.port = 11625;
nodeObject.publicKey =
	'GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK';
nodeObject.geoData = {
	countryName: 'United States',
	countryCode: 'US',
	latitude: 39.0853,
	longitude: -77.6452
};
nodeObject.versionStr = 'v10.0.0';
nodeObject.statistics = {
	active24HoursPercentage: 0,
	active30DaysPercentage: 0,
	validating24HoursPercentage: 0,
	validating30DaysPercentage: 0,
	overLoaded24HoursPercentage: 0,
	overLoaded30DaysPercentage: 0,
	has30DayStats: true,
	has24HourStats: true
};

nodeObject.dateDiscovered = '2018-04-28T12:39:01.000Z';
nodeObject.dateUpdated = '2018-10-12T09:17:39.000Z';
nodeObject.quorumSetHashKey = 'dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=';
nodeObject.quorumSet = {
	threshold: 2,
	validators: ['GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ'],
	innerQuorumSets: []
};
nodeObject.active = true;
nodeObject.overLoaded = false;
nodeObject.isFullValidator = true;
nodeObject.homeDomain = 'my-domain';
nodeObject.isValidating = false;
nodeObject.organizationId = '123';
nodeObject.alias = 'my-alias';
nodeObject.historyUrl = 'https://my-history.net';
nodeObject.isp = 'amazon.com Inc.';

nodeObject.isValidator = true;
nodeObject.activeInScp = false;
nodeObject.ledgerVersion = null;
nodeObject.networkId = null;
nodeObject.overlayMinVersion = null;
nodeObject.overlayVersion = null;
const trustedNodeObject: Record<string, unknown> = {};
trustedNodeObject.publicKey =
	'GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ';
trustedNodeObject.unknown = true;
trustedNodeObject.dateDiscovered = '2018-04-28 14:39:01';
trustedNodeObject.dateUpdated = '2018-10-12 11:17:39';
nodeObject.historyArchiveHasError = true;

test('nodeToJson', () => {
	expect(JSON.parse(JSON.stringify(node))).toEqual(nodeObject);
});
test('JsonToNode', () => {
	expect(Node.fromJSON(JSON.stringify(nodeObject))).toEqual(node);
});
const node3 = new Node('a');
test('testDefaultPort', () => {
	expect(node3.port).toEqual(11625);
});

import {Node, Organization} from '../src'

let node = new Node("54.221.140.73", 11625, "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK");
node.name = "SDF validator 2";
node.host = "core-live-b.stellar.org";
node.ledgerVersion = undefined;
node.networkId = undefined;
node.overlayMinVersion = undefined;
node.overlayVersion = undefined;
node.geoData.city = "Ashburn";
node.geoData.countryName = "United States";
node.geoData.countryCode = "US";
node.geoData.latitude = 39.0853;
node.geoData.longitude = -77.6452;
node.geoData.metroCode = undefined;
node.geoData.regionCode = undefined;
node.geoData.regionName = undefined;
node.geoData.timeZone = undefined;
node.geoData.zipCode = undefined;
node.versionStr = "v10.0.0";
node.statistics.activeInLastCrawl = true;
node.statistics.overLoadedInLastCrawl = false;
node.dateDiscovered = new Date("2018-04-28 14:39:01");
node.dateUpdated = new Date("2018-10-12 11:17:39");
node.quorumSet.hashKey = "dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=";
node.quorumSet.threshold = 2;
node.quorumSet.validators = ["GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ","GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH","GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK"];
node.quorumSet.innerQuorumSets = [];
node.active = true;
node.overLoaded = false;
node.isFullValidator = true;
node.homeDomain = 'my-domain';
node.isValidating = false;
node.organizationId = '123';

let nodeObject:any = {};
nodeObject.name = "SDF validator 2";
nodeObject.host = "core-live-b.stellar.org";
nodeObject.index = 0;
nodeObject.ip = "54.221.140.73";
nodeObject.port = 11625;
nodeObject.publicKey = "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK";
nodeObject.geoData = {};
nodeObject.geoData.city = "Ashburn";
nodeObject.geoData.countryName = "United States";
nodeObject.geoData.countryCode = "US";
nodeObject.geoData.latitude = 39.0853;
nodeObject.geoData.longitude = -77.6452;
nodeObject.versionStr = "v10.0.0";
nodeObject.statistics = {};
nodeObject.statistics.activeInLastCrawl = true;
nodeObject.statistics.validatingInLastCrawl = false;
nodeObject.statistics.overLoadedInLastCrawl = false;
nodeObject.statistics.active24HoursPercentage = 0;
nodeObject.statistics.active7DaysPercentage = 0;
nodeObject.statistics.validating24HoursPercentage = 0;
nodeObject.statistics.validating7DaysPercentage = 0;
nodeObject.statistics.overLoaded24HoursPercentage = 0;
nodeObject.statistics.overLoaded7DaysPercentage = 0;
nodeObject.dateDiscovered = "2018-04-28T12:39:01.000Z";
nodeObject.dateUpdated = "2018-10-12T09:17:39.000Z";
nodeObject.quorumSet = {};
nodeObject.quorumSet.hashKey = "dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=";
nodeObject.quorumSet.threshold = 2;
nodeObject.quorumSet.validators = ["GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ","GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH","GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK"];
nodeObject.quorumSet.innerQuorumSets = [];
nodeObject.active = true;
nodeObject.overLoaded = false;
nodeObject.isValidator = true;
nodeObject.isFullValidator = true;
nodeObject.homeDomain = 'my-domain';
nodeObject.isValidating = false;
nodeObject.organizationId = '123';

test('nodeToJson', () => {
    expect(JSON.parse(JSON.stringify(node))).toEqual(nodeObject);
});
test('JsonToNode', () => {
    expect(Node.fromJSON((JSON.stringify(nodeObject)))).toEqual(node);
});

let node3 = new Node("localhost");
test('testDefaultPort', () => {
    expect(node3.port).toEqual(11625);
});
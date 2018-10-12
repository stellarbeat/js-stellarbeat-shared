const Node = require('./../lib/node.js');


let nodeJson = '{' +
    '"publicKey":"GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK",' +
    '"name":"SDF validator 2",' +
    '"geoData":{' +
    '"city":"Ashburn",' +
    '"countryName":"United States", ' +
    '"countryCode": "US", ' +
    '"latitude":"39.0853",' +
    '"longitude":"-77.6452"' +
    '},' +
    '"host":"core-live-b.stellar.org",' +
    '"ip":"54.221.140.73",' +
    '"port":"11625",' +
    '"versionStr":"v10.0.0",' +
    '"active":true,' +
    '"quorumSet":{' +
    '"hashKey":"dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=",' +
    '"threshold":2,"validators":["GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ","GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH","GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK"],' +
    '"innerQuorumSets":[]' +
    '},' +
    '"statistics":{' +
    '"dateDiscovered":"2018-04-28 14:39:01",' +
    '"dateUpdated":"2018-10-12 11:17:39",' +
    '"activeCounter":5' +
    '}' +
    '}';

let node1 = new Node('localhost', '8080');
node1.publicKey = '123';

test('nodeToJson', () => {
    expect(JSON.stringify(node1)).toBe("{\"ip\":\"localhost\",\"port\":\"8080\",\"publicKey\":\"123\",\"quorumSet\":{\"threshold\":9007199254740991,\"validators\":[],\"innerQuorumSets\":[]},\"geoData\":{},\"statistics\":{\"activeCounter\":0,\"activeRating\":0}}");
});

let node2 = new Node("54.221.140.73", "11625", "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK");
node2.name = "SDF validator 2";
node2.host = "core-live-b.stellar.org";
node2.ledgerVersion = undefined;
node2.networkId = undefined;
node2.overlayMinVersion = undefined;
node2.overlayVersion = undefined;
node2.geoData.city = "Ashburn";
node2.geoData.countryName = "United States";
node2.geoData.countryCode = "US";
node2.geoData.latitude = "39.0853";
node2.geoData.longitude = "-77.6452";
node2.geoData.metroCode = undefined;
node2.geoData.regionCode = undefined;
node2.geoData.regionName = undefined;
node2.geoData.timeZone = undefined;
node2.geoData.zipCode = undefined;
node2.versionStr = "v10.0.0";
node2.statistics.activeCounter = 5;
node2.statistics.dateDiscovered = "2018-04-28 14:39:01";
node2.statistics.dateUpdated = "2018-10-12 11:17:39";
node2.quorumSet.hashKey = "dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=";
node2.quorumSet.threshold = 2;
node2.quorumSet.validators = ["GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ","GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH","GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK"];
node2.quorumSet.innerQuorumSets = [];
node2.active = true;

test('fromJson', () => {
    expect(Node.fromJSON(nodeJson)).toEqual(node2)
});
import {Node} from '../src'

let nodeJson = '{' +
    '"publicKey":"GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK",' +
    '"name":"SDF validator 2",' +
    '"homeDomain":"my-domain",'+
    '"geoData":{' +
    '"city":"Ashburn",' +
    '"countryName":"United States", ' +
    '"countryCode": "US", ' +
    '"latitude":39.0853,' +
    '"longitude":-77.6452' +
    '},' +
    '"host":"core-live-b.stellar.org",' +
    '"index": 0,' +
    '"ip":"54.221.140.73",' +
    '"isFullValidator": true,' +
    '"port":11625,' +
    '"versionStr":"v10.0.0",' +
    '"active":true,' +
    '"overLoaded":false,' +
    '"quorumSet":{' +
    '"hashKey":"dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=",' +
    '"threshold":2,"validators":["GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ","GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH","GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK"],' +
    '"innerQuorumSets":[]' +
    '},' +
    '"dateDiscovered":"2018-04-28 14:39:01",' +
    '"dateUpdated":"2018-10-12 11:17:39",' +
    '"statistics":{' +
    '"activeCounter":5,' +
    '"overLoadedCounter":0,' +
    '"activeInLastCrawl":true,' +
    '"overLoadedInLastCrawl":false' +
    '}' +
    '}';

let node1 = new Node('localhost', 8080);
node1.publicKey = '123';
node1.statistics.activeInLastCrawl = true;
node1.statistics.overLoadedInLastCrawl = false;
node1.dateUpdated = new Date("2018-04-28 14:39:01");
node1.dateDiscovered = new Date("2018-04-28 14:39:02");
node1.homeDomain = "my-domain";

test('nodeToJson', () => {
    expect(JSON.stringify(node1)).toBe("{\"ip\":\"localhost\",\"port\":8080,\"publicKey\":\"123\",\"active\":false,\"overLoaded\":false," +
        "\"quorumSet\":{\"threshold\":9007199254740991,\"validators\":[],\"innerQuorumSets\":[]}," +
        "\"geoData\":{}," +
        "\"statistics\":{\"activeCounter\":0,\"overLoadedCounter\":0,\"activeRating\":0,\"activeInLastCrawl\":true,\"overLoadedInLastCrawl\":false,\"validatingInLastCrawl\":false,\"validatingCounter\":0,\"validatingRating\":0},\"dateDiscovered\":\"2018-04-28T12:39:02.000Z\",\"dateUpdated\":\"2018-04-28T12:39:01.000Z\",\"isValidator\":false,\"isFullValidator\":false,\"isValidating\":false,\"index\":0,\"homeDomain\":\"my-domain\"}");
});

let node2 = new Node("54.221.140.73", 11625, "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK");
node2.name = "SDF validator 2";
node2.host = "core-live-b.stellar.org";
node2.ledgerVersion = undefined;
node2.networkId = undefined;
node2.overlayMinVersion = undefined;
node2.overlayVersion = undefined;
node2.geoData.city = "Ashburn";
node2.geoData.countryName = "United States";
node2.geoData.countryCode = "US";
node2.geoData.latitude = 39.0853;
node2.geoData.longitude = -77.6452;
node2.geoData.metroCode = undefined;
node2.geoData.regionCode = undefined;
node2.geoData.regionName = undefined;
node2.geoData.timeZone = undefined;
node2.geoData.zipCode = undefined;
node2.versionStr = "v10.0.0";
node2.statistics.activeCounter = 5;
node2.statistics.activeInLastCrawl = true;
node2.statistics.overLoadedInLastCrawl = false;
node2.dateDiscovered = new Date("2018-04-28 14:39:01");
node2.dateUpdated = new Date("2018-10-12 11:17:39");
node2.quorumSet.hashKey = "dbROBZB26KK3PELCVOi5CDds2zSvTK5GOPTqVXBMw8=";
node2.quorumSet.threshold = 2;
node2.quorumSet.validators = ["GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ","GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH","GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK"];
node2.quorumSet.innerQuorumSets = [];
node2.active = true;
node2.overLoaded = false;
node2.isFullValidator = true;
node2.homeDomain = 'my-domain';

test('fromJson', () => {
    expect(Node.fromJSON(nodeJson)).toEqual(node2)
});

let node3 = new Node("localhost");
test('testDefaultPort', () => {
    expect(node3.port).toEqual(11625);
});
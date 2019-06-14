import {QuorumSet, Node, generateTomlString, getPublicKeysToNodesMap} from "../src";

let node1 = new Node("localhost");
node1.publicKey = "GAOO3LWBC4XF6VWRP5ESJ6IBHAISVJMSBTALHOQM2EZG7Q477UWA6L7U";
node1.name = "a with spaces";

let node2 = new Node("localhost");
node2.publicKey = "GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH";
node2.alias = "my-alias";
node2.name = "b";

let node3 = new Node("localhost");
node3.publicKey = "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK";
node3.name = "c";

let node4 = new Node("localhost");
node4.publicKey = "GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ";
node4.name = "d";

let nodesMap = getPublicKeysToNodesMap([node1,node2,node3,node4]);

let quorumSet = new QuorumSet();
quorumSet.validators = [ node1.publicKey, node2.publicKey, node3.publicKey, node4.publicKey];
quorumSet.hashKey = "BbRCDpvX3jlA0ycxYVJdEIB8AzYG01BBXmOll66M5bc=";
quorumSet.threshold = 3;

let innerQuorumSet1 = new QuorumSet();
innerQuorumSet1.hashKey = "z";
innerQuorumSet1.threshold = 2;
innerQuorumSet1.validators = [node1.publicKey, node2.publicKey, node3.publicKey];

let innerQuorumSet2 = new QuorumSet();
innerQuorumSet2.hashKey = "y";
innerQuorumSet2.threshold = 1;
innerQuorumSet2.validators = [node3.publicKey, node4.publicKey];

let innerQuorumSet21 = new QuorumSet();
innerQuorumSet21.hashKey = "x";
innerQuorumSet21.threshold = 1;
innerQuorumSet21.validators = [node1.publicKey];

innerQuorumSet2.innerQuorumSets.push(innerQuorumSet21);

quorumSet.innerQuorumSets.push(innerQuorumSet1, innerQuorumSet2);

let tomlString = `[QUORUM_SET]
THRESHOLD_PERCENT=34
VALIDATORS=[
    "GAOO3LWBC4XF6VWRP5ESJ6IBHAISVJMSBTALHOQM2EZG7Q477UWA6L7U a-with-spaces",
    "GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH my-alias",
    "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK c",
    "GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ d"
]
[QUORUM_SET.1]
THRESHOLD_PERCENT=34
VALIDATORS=[
    "GAOO3LWBC4XF6VWRP5ESJ6IBHAISVJMSBTALHOQM2EZG7Q477UWA6L7U a-with-spaces",
    "GCGB2S2KGYARPVIA37HYZXVRM2YZUEXA6S33ZU5BUDC6THSB62LZSTYH my-alias",
    "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK c"
]
[QUORUM_SET.2]
THRESHOLD_PERCENT=1
VALIDATORS=[
    "GCM6QMP3DLRPTAZW2UZPCPX2LF3SXWXKPMP3GKFZBDSF3QZGV2G5QSTK c",
    "GABMKJM6I25XI4K7U6XWMULOUQIQ27BCTMLS6BYYSOWKTBUXVRJSXHYQ d"
]
[QUORUM_SET.2.1]
THRESHOLD_PERCENT=1
VALIDATORS=[
    "GAOO3LWBC4XF6VWRP5ESJ6IBHAISVJMSBTALHOQM2EZG7Q477UWA6L7U a-with-spaces"
]
`;


test('format', () => {
    expect(generateTomlString(quorumSet, nodesMap)).toEqual(tomlString);
});
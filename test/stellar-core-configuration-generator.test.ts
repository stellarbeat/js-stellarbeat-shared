import StellarCoreConfigurationGenerator from "../src/stellar-core-configuration-generator";
import {Network, Node, Organization, QuorumSet} from "../src";

test("quorumSetToToml", ()=>{
    let node = new Node("a");
    node.name = 'a';


    let nodeB = new Node("b");
    nodeB.name = 'b';
    nodeB.homeDomain = 'highQuality.com'
    nodeB.historyUrl = 'myHistory.org';
    let orgHighQuality = new Organization('orgHighQuality', 'orgHighQuality');
    nodeB.organization = orgHighQuality;

    orgHighQuality.has30DayStats = true;
    orgHighQuality.subQuorum30DaysAvailability = 100;

    let orgLowQuality = new Organization('orgLowQuality', 'orgLowQuality');
    let nodeC = new Node("c");
    nodeC.name = 'c';
    nodeC.organization = orgLowQuality;
    nodeC.homeDomain = 'lowQuality.com';

    let nodeD = new Node( "d");
    nodeD.name = 'd';
    let nodeE = new Node("e");
    let nodeF = new Node("f");
    node.quorumSet.validators.push(nodeB);
    node.quorumSet.validators.push(nodeD);
    let innerQSet = new QuorumSet();
    innerQSet.validators.push(nodeC);
    node.quorumSet.innerQuorumSets.push(innerQSet);
    orgHighQuality.validators.push(...[nodeB, nodeE, nodeF]);
    let nodes:Node[] = [node, nodeB, nodeC, nodeD];
    let organizations:Organization[] = [orgHighQuality, orgLowQuality];
    let network = new Network(nodes, organizations);
    let quorumSetCoreConfiguration = new StellarCoreConfigurationGenerator(network);
    expect(quorumSetCoreConfiguration.quorumSetToToml(node.quorumSet)).toEqual(`[[HOME_DOMAINS]]
HOME_DOMAIN = "highQuality.com"
QUALITY = "HIGH"

[[HOME_DOMAINS]]
HOME_DOMAIN = "lowQuality.com"
QUALITY = "MEDIUM_OR_LOW"

[[VALIDATORS]]
NAME = "b"
PUBLIC_KEY = "b"
ADDRESS = "127.0.0.1:11625"
HISTORY = "curl -sf myHistory.org -o {1}"
HOME_DOMAIN = "highQuality.com"

[[VALIDATORS]]
NAME = "d"
PUBLIC_KEY = "d"
ADDRESS = "127.0.0.1:11625"
QUALITY = "MEDIUM_OR_LOW"

[[VALIDATORS]]
NAME = "c"
PUBLIC_KEY = "c"
ADDRESS = "127.0.0.1:11625"
HOME_DOMAIN = "lowQuality.com"
`);
});

test("nodesToToml", ()=>{
    let nodeB = new Node("b");
    nodeB.name = 'b';
    nodeB.homeDomain = 'highQuality.com'
    let orgHighQuality = new Organization('orgHighQuality', 'orgHighQuality');

    nodeB.organization = orgHighQuality;
    nodeB.historyUrl = 'myHistory.org';
    orgHighQuality.has30DayStats = true;
    orgHighQuality.subQuorum30DaysAvailability = 100;
    orgHighQuality.validators.push(...[nodeB, new Node("e"), new Node("f")]);
    let orgLowQuality = new Organization('orgLowQuality', 'orgLowQuality');
    let nodeC = new Node("c");
    nodeC.organization = orgLowQuality;
    nodeC.homeDomain = 'lowQuality.com';
    nodeC.name = 'c'
    let network = new Network([nodeB, nodeC], [orgHighQuality, orgLowQuality]);
    let quorumSetCoreConfiguration = new StellarCoreConfigurationGenerator(network);
   expect(quorumSetCoreConfiguration.nodesToToml([nodeB, nodeC])).toEqual(`[[HOME_DOMAINS]]
HOME_DOMAIN = "highQuality.com"
QUALITY = "HIGH"

[[HOME_DOMAINS]]
HOME_DOMAIN = "lowQuality.com"
QUALITY = "MEDIUM_OR_LOW"

[[VALIDATORS]]
NAME = "b"
PUBLIC_KEY = "b"
ADDRESS = "127.0.0.1:11625"
HISTORY = "curl -sf myHistory.org -o {1}"
HOME_DOMAIN = "highQuality.com"

[[VALIDATORS]]
NAME = "c"
PUBLIC_KEY = "c"
ADDRESS = "127.0.0.1:11625"
HOME_DOMAIN = "lowQuality.com"
`)
});
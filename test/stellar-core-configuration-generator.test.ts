import StellarCoreConfigurationGenerator from "../src/stellar-core-configuration-generator";
import {Network, Node, Organization, QuorumSet} from "../src";

test("quorumSetToToml", ()=>{
    let node = new Node('localhost');
    node.publicKey = 'a';
    node.quorumSet.validators.push('b');
    node.quorumSet.validators.push('d');
    let innerQSet = new QuorumSet();
    innerQSet.validators.push('c');
    node.quorumSet.innerQuorumSets.push(innerQSet);
    let nodeB = new Node('otherHost');
    nodeB.publicKey = 'b';
    nodeB.homeDomain = 'highQuality.com'
    nodeB.organizationId = 'orgHighQuality';
    nodeB.historyUrl = 'myHistory.org';
    let orgHighQuality = new Organization('orgHighQuality', 'orgHighQuality');
    orgHighQuality.has30DayStats = true;
    orgHighQuality.subQuorum30DaysAvailability = 100;
    orgHighQuality.validators.push(...['b', 'e', 'f']);
    let orgLowQuality = new Organization('orgLowQuality', 'orgLowQuality');
    let nodeC = new Node('yetAnotherHost');
    nodeC.publicKey = 'c';
    nodeC.organizationId = 'orgLowQuality';
    nodeC.homeDomain = 'lowQuality.com';

    let nodeD = new Node('hostD');
    nodeD.publicKey = 'd';

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
ADDRESS = "otherHost:11625"
HISTORY = "curl -sf myHistory.org -o {1}"
HOME_DOMAIN = "highQuality.com"

[[VALIDATORS]]
NAME = "d"
PUBLIC_KEY = "d"
ADDRESS = "hostD:11625"
QUALITY = "MEDIUM_OR_LOW"

[[VALIDATORS]]
NAME = "c"
PUBLIC_KEY = "c"
ADDRESS = "yetAnotherHost:11625"
HOME_DOMAIN = "lowQuality.com"
`);
});

test("nodesToToml", ()=>{
    let nodeB = new Node('otherHost');
    nodeB.publicKey = 'b';
    nodeB.homeDomain = 'highQuality.com'
    nodeB.organizationId = 'orgHighQuality';
    nodeB.historyUrl = 'myHistory.org';
    let orgHighQuality = new Organization('orgHighQuality', 'orgHighQuality');
    orgHighQuality.has30DayStats = true;
    orgHighQuality.subQuorum30DaysAvailability = 100;
    orgHighQuality.validators.push(...['b', 'e', 'f']);
    let orgLowQuality = new Organization('orgLowQuality', 'orgLowQuality');
    let nodeC = new Node('yetAnotherHost');
    nodeC.publicKey = 'c';
    nodeC.organizationId = 'orgLowQuality';
    nodeC.homeDomain = 'lowQuality.com';
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
ADDRESS = "otherHost:11625"
HISTORY = "curl -sf myHistory.org -o {1}"
HOME_DOMAIN = "highQuality.com"

[[VALIDATORS]]
NAME = "c"
PUBLIC_KEY = "c"
ADDRESS = "yetAnotherHost:11625"
HOME_DOMAIN = "lowQuality.com"
`)
});
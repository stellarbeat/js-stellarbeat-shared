import {Network} from "./network";
import {Node} from "./node";
import {stringify} from "@iarna/toml";
import {QuorumSet} from "./quorum-set";

enum Quality {
    HIGH = 'HIGH',
    MEDIUM_OR_LOW = 'MEDIUM_OR_LOW'
}

type HomeDomain = {
    HOME_DOMAIN: string;
    QUALITY: Quality;
}

type Validator = {
    NAME: string; 	//A unique alias for the node
    QUALITY?: string; //Rating for node (required unless specified in [[HOME_DOMAINS]]): HIGH, MEDIUM, or LOW.
    HOME_DOMAIN?: string //URL of home domain linked to validator
    PUBLIC_KEY: string  //Stellar public key associated with validator
    ADDRESS?: string //	Peer:port associated with validator (optional)
    HISTORY?: string //	archive GET command associated with validator (optional)
}

type TomlConfig = {
    HOME_DOMAINS: HomeDomain[];
    VALIDATORS: Validator[];
}

export default class StellarCoreConfigurationGenerator {
    protected network: Network;

    constructor(network: Network) {
        this.network = network;
    }

    quorumSetToToml(quorumSet: QuorumSet) {
        let alreadyAddedHomeDomains: Set<string> = new Set<string>();
        let tomlConfig: TomlConfig = {
            HOME_DOMAINS: [],
            VALIDATORS: []
        };

        this.processQuorumSet(quorumSet, tomlConfig, alreadyAddedHomeDomains);

        //@ts-ignore library doesn't handle undefined values correctly
        return stringify(tomlConfig);
    }

    nodesToToml(nodes:Node[]) {
        let alreadyAddedHomeDomains: Set<string> = new Set<string>();
        let tomlConfig: TomlConfig = {
            HOME_DOMAINS: [],
            VALIDATORS: []
        };
        nodes.forEach(node => this.processValidator(node, alreadyAddedHomeDomains, tomlConfig))

        //@ts-ignore library doesn't handle undefined values correctly
        return stringify(tomlConfig);
    }

    protected processQuorumSet(quorumSet: QuorumSet, tomlConfig: TomlConfig, alreadyAddedHomeDomains: Set<string> = new Set<string>()) {
        quorumSet.validators.forEach(
            validator => this.processValidator(validator, alreadyAddedHomeDomains, tomlConfig)
        );

        quorumSet.innerQuorumSets.forEach(innerQSet => this.processQuorumSet(innerQSet, tomlConfig, alreadyAddedHomeDomains))

    }

    protected processValidator(validatorNode: Node, alreadyAddedHomeDomains: Set<string>, tomlConfig: TomlConfig) {
        let validatorToml: Validator = {
            NAME: validatorNode.displayName!,
            PUBLIC_KEY: validatorNode.publicKey!,
            ADDRESS: validatorNode.key,
        };
        if (validatorNode.historyUrl)
            validatorToml.HISTORY = `curl -sf ${validatorNode.historyUrl} -o {1}`;

        if (validatorNode.homeDomain) {
            let quality = Quality.MEDIUM_OR_LOW;
            if (validatorNode.organization) {
                let organization = this.network.getOrganizationById(validatorNode.organization.id);
                if (organization!.isTierOneOrganization)
                    quality = Quality.HIGH;
            }

            if (!alreadyAddedHomeDomains.has(validatorNode.homeDomain)) {
                alreadyAddedHomeDomains.add(validatorNode.homeDomain);
                tomlConfig.HOME_DOMAINS.push({
                    HOME_DOMAIN: validatorNode.homeDomain,
                    QUALITY: quality
                })
            }

            validatorToml.HOME_DOMAIN = validatorNode.homeDomain;
        } else {
            validatorToml.QUALITY = Quality.MEDIUM_OR_LOW;
        }

        tomlConfig.VALIDATORS!.push(validatorToml);
    }
}
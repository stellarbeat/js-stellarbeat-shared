import {Node, QuorumSet} from "./index";

//todo: use toml nodejs package
function getThresholdPercentage(quorumSet: QuorumSet): number {
    return Math.ceil((((quorumSet.threshold - 1) * 100) + 1)
        / (quorumSet.validators.length + quorumSet.innerQuorumSets.length));
}

function getValidatorsStringPart(quorumSet, publicKeysToNodesMap) {
    let validatorsStringPart = 'VALIDATORS=[\n';
    quorumSet.validators.forEach((validator, index) => {
        validatorsStringPart += '    "' + validator;
        let alias = publicKeysToNodesMap.get(validator).alias;
        if(alias) {
            validatorsStringPart += ' '
                + alias + '"';
        } else {
            let name = publicKeysToNodesMap.get(validator).name;
            if(name) {
                name = name.replace(/ /g, '_');
                validatorsStringPart += ' '
                    + name + '"';
            }
        }
        if (index !== quorumSet.validators.length - 1) {
            validatorsStringPart += ',';
        }
        validatorsStringPart += '\n';
    });
    return validatorsStringPart;
}

export function generateTomlString(quorumSet: QuorumSet, publicKeysToNodesMap: Map<string, Node>, prefix: string = ""): string {
    let tomlString = '[QUORUM_SET' + prefix + ']\n';
    tomlString += 'THRESHOLD_PERCENT=' + getThresholdPercentage(quorumSet) + '\n';
    tomlString += getValidatorsStringPart(quorumSet, publicKeysToNodesMap);
    tomlString += ']\n';

    for (let i = 0; i < quorumSet.innerQuorumSets.length; i++) {
        let newPrefix = prefix + '.' + (i + 1);
        tomlString += generateTomlString(quorumSet.innerQuorumSets[i], publicKeysToNodesMap, newPrefix);
    }

    return tomlString;
}
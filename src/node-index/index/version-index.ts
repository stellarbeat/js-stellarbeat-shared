import {Network, Node} from "./../../index";
import * as semverCompare from "semver-compare";
import * as findVersions from "find-versions";
import * as semver from "semver";

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class VersionIndex {

    _network: Network;
    _highestStellarCoreVersion: string;

    constructor(network: Network) {
        this._network = network;
        this._highestStellarCoreVersion = this.getHighestStellarCoreVersion(this._network.nodes);
    }

    getHighestStellarCoreVersion(nodes:Node[]) {
        let versions = nodes
            .map(node => node.versionStr)
            .filter(version => version!==undefined)
            .map(versionDirty => findVersions(versionDirty, {"loose": false})[0])
            .filter(node => node !== undefined);
        //release candidates get filtered out.

        let sortedVersions = versions.sort(semverCompare);

        if (sortedVersions.length === 0) {
            return "0.0.0";
        }

        return versions[versions.length - 1];
    }

    get(node: Node): number {
        if(node.versionStr === undefined) {
            return 0;
        }

        let version = findVersions(node.versionStr, {"loose": true})[0]; //get release candidates
        if(semver.gt(version, this._highestStellarCoreVersion)) { //release candidates higher then current stable
            return 1;
        }

        switch (semver.diff(version, this._highestStellarCoreVersion)) {
            case undefined:
                return 1;
            case null:
                return 1;
            case "patch":
                return 0.8;
            case "prepatch":
                return 0.8;
            case "minor":
                return 0.6;
            case "preminor":
                return 0.6;
            case "major":
                return 0.3;
            case "premajor":
                return 0.3;
            case "prerelease":
                return 0.8;
        }
    }
}
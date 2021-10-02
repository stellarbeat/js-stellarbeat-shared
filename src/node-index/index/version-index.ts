import {Node} from "./../../index";
import * as semverCompare from "semver-compare";
import * as findVersions from "find-versions";
import {gt, diff} from "semver";

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class VersionIndex {

    _nodes: Node[];
    _highestStellarCoreVersion: string;

    constructor(nodes: Node[]) {
        this._nodes = nodes;
        this._highestStellarCoreVersion = this.getHighestStellarCoreVersion(nodes);
    }

    getHighestStellarCoreVersion(nodes:Node[]) {
        let versions = nodes
            .map(node => node.versionStr)
            .filter(version => version!==null)
            .filter(version => version!.match(/[.-]rc/) === null)
            .map(versionDirty => findVersions(versionDirty!, {"loose": false})[0])
            .filter(version => version !== undefined);
        //release candidates get filtered out.

        let sortedVersions = versions.sort(semverCompare);

        if (sortedVersions.length === 0) {
            return "0.0.0";
        }

        return versions[versions.length - 1];
    }

    get(node: Node): number {
        if(!node.versionStr) {
            return 0;
        }

        let version = findVersions(node.versionStr, {"loose": true})[0]; //get release candidates

        if(version === undefined) {
            return 0;
        }

        if(gt(version, this._highestStellarCoreVersion)) { //release candidates higher then current stable
            return 1;
        }

        switch (diff(version, this._highestStellarCoreVersion)) {
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
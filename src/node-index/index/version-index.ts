import { Node } from './../../index';
import * as semverCompare from 'semver-compare';
import { diff, gt } from 'semver';
import semver = require('semver/preload');
import { isString } from '../../typeguards';

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

	getHighestStellarCoreVersion(nodes: Node[]) {
		const versions = nodes
			.map((node) => node.versionStr)
			.filter((version) => isString(version))
			.filter((version) => {
				const match = (version as string).match(/.*-?rc[0-9]*$/);
				return match === null;
			})
			.map((versionDirty) => {
				return semver.clean(this.preClean(versionDirty as string), {
					loose: false,
					includePrerelease: false
				});
			})
			.filter((version) => version !== null);
		//release candidates get filtered out.

		const sortedVersions = versions.sort(semverCompare);

		if (sortedVersions.length === 0) {
			return '0.0.0';
		}

		return versions[versions.length - 1] as string;
	}

	protected preClean(version: string) {
		version = version.replace(/\(.*\)/, '');
		version = version.replace(/^.*?([0-9].*)/, '$1');

		return version;
	}

	get(node: Node): number {
		if (!node.versionStr) {
			return 0;
		}

		const version = semver.clean(this.preClean(node.versionStr), {
			loose: true,
			includePrerelease: false
		}); //get release candidates
		if (!version) {
			return 0;
		}
		if (gt(version, this._highestStellarCoreVersion)) {
			//release candidates higher then current stable
			return 1;
		}

		switch (diff(version, this._highestStellarCoreVersion)) {
			case undefined:
				return 1;
			case null:
				return 1;
			case 'patch':
				return 0.8;
			case 'prepatch':
				return 0.8;
			case 'minor':
				return 0.6;
			case 'preminor':
				return 0.6;
			case 'major':
				return 0.3;
			case 'premajor':
				return 0.3;
			case 'prerelease':
				return 0.8;
			default:
				return 0;
		}
	}
}

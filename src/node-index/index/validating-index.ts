import { Node } from '../../node';

export class ValidatingIndex {
	static get(node: Node): number {
		return node.statistics.validating30DaysPercentage / 100;
	}
}

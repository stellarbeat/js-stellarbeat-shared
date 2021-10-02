import { Node } from '../../node';

export class ActiveIndex {
	static get(node: Node): number {
		return node.statistics.active30DaysPercentage / 100;
	}
}

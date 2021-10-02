import { Node } from './node';
import { isObject, isString } from './typeguards';

export class NodeSnapShot {
	public startDate: Date;
	public endDate: Date;
	public node: Node;

	constructor(startDate: Date, endDate: Date, node: Node) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.node = node;
	}

	toJSON(): Record<string, unknown> {
		return {
			startDate: this.startDate,
			endDate: this.endDate,
			node: this.node
		};
	}

	static fromJSON(
		nodeSnapShot: string | Record<string, unknown>
	): NodeSnapShot {
		let snapShotObject: Record<string, unknown>;
		if (typeof nodeSnapShot === 'string') {
			snapShotObject = JSON.parse(nodeSnapShot);
		} else snapShotObject = nodeSnapShot;

		if (!isString(snapShotObject.startDate))
			throw new Error('StartDate missing');
		if (!isString(snapShotObject.endDate)) throw new Error('EndDate missing');
		if (!isObject(snapShotObject.node)) throw new Error('Node missing');

		return new NodeSnapShot(
			new Date(snapShotObject.startDate),
			new Date(snapShotObject.endDate),
			Node.fromJSON(snapShotObject.node)
		);
	}
}

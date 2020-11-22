import {Node} from "./node";

export class NodeSnapShot {
    public startDate: Date;
    public endDate: Date;
    public node: Node;

    constructor(startDate: Date, endDate: Date, node: Node) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.node = node;
    }

    toJSON():Object {
        return {
            startDate: this.startDate,
            endDate: this.endDate,
            node: this.node
        }
    }

    /*static fromJSON(nodeSnapShot:string|Object):NodeSnapShot {
        let snapShotObject: any;
        if (typeof nodeSnapShot === 'string') {
            snapShotObject = JSON.parse(nodeSnapShot);
        } else
            snapShotObject = nodeSnapShot;

        return new NodeSnapShot(
            new Date(snapShotObject.startDate),
            new Date(snapShotObject.endDate),
            Node.fromJSON(snapShotObject.node)
        );
    }*/
}
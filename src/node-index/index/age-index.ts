import {Node} from "../../node";
import {NodeStatistics} from "../../node-statistics";

/**
 * Index for node availability. Availability is the amount of times the node was active in the latest x crawls.
 */
export class AgeIndex {
    static get(node:Node):number {
        let monthDifference = AgeIndex.monthDifference(node.dateDiscovered, new Date());
        if(monthDifference > 6)//older then 6 months
            return 1;
        else
            return monthDifference/6;
    }

    protected static monthDifference(date1, date2) {
        let months;
        months = (date2.getFullYear() - date1.getFullYear()) * 12;
        months -= date1.getMonth() + 1;
        months += date2.getMonth();
        return months <= 0 ? 0 : months;
    }
}
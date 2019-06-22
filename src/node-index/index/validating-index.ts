import {Node} from "../../node";
import {NodeStatistics} from "../../node-statistics";

export class ValidatingIndex {
    static get(node:Node):number {
        return node.statistics.validating30DaysPercentage/100;
    }
}
import {Node} from "../../node";
import {NodeStatistics} from "../../node-statistics";

/**
 * Index for node availability. Availability is the amount of times the node was active in the latest x crawls.
 */
export class AvailabilityIndex {
    static get(node:Node):number {
        return node.statistics.activeCounter/NodeStatistics.MAX_ACTIVE_COUNTER;
    }
}
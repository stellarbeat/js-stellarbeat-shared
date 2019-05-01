import {Node} from "../../node";

/**
 * Index for node type (full validator, basic validator or watcher node)
 */
export class TypeIndex {
    static get(node:Node):number {
        if(node.isFullValidator) {
            return 1;
        }
        if(node.isValidator) {
            return 0.7;
        }

        return 0.3;
    }
}
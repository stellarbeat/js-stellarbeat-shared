/**
 * Modify the network
 */
import {Network, Node, QuorumSet} from "../index";
import {EntityPropertyUpdateQueueManager} from "./entity-property-update-queue-manager";
import {EntityPropertyUpdate} from "./entity-property-update";

type PublicKey = string;

export class NetworkSimulation {
    protected _network: Network;
    protected _nodePropUpdateQueueManagers: Map<PublicKey, EntityPropertyUpdateQueueManager>;

    constructor(network: Network) {
        this._network = network;
        this._nodePropUpdateQueueManagers = new Map();
    }

    get network():Network {
        return this._network;
    }

    updateNodeProperty(node:Node, propertyName:string, newValue:any) {
        let update = new EntityPropertyUpdate(node, propertyName, newValue);
        this.executeUpdate(node, update);
    }

    updateNodeQuorumSetProperty(node:Node, quorumSet:QuorumSet, propertyName:string, newValue:any) {
        let update = new EntityPropertyUpdate(quorumSet, propertyName, newValue);
        this.executeUpdate(node, update);
    }

    protected executeUpdate(node:Node, update:EntityPropertyUpdate):void {
        if(!this._nodePropUpdateQueueManagers.get(node.publicKey)) {
            this._nodePropUpdateQueueManagers.set(node.publicKey, new EntityPropertyUpdateQueueManager());
        }

        this._nodePropUpdateQueueManagers.get(node.publicKey).execute(update);

        this._network.updateNetwork();
    }

    undoNodeUpdate(node:Node) {
        this._nodePropUpdateQueueManagers.get(node.publicKey).undo();
    }

    redoNodeUpdate(node:Node) {
        this._nodePropUpdateQueueManagers.get(node.publicKey).redo();
    }
}
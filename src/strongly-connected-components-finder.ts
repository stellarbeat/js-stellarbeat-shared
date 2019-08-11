import {Network} from "./network";
import {Node} from "./node";
import {QuorumSet} from "./quorum-set";
import {StronglyConnectedComponent} from "./strongly-connected-component";

type PublicKey = string;
type Time = number;

/*
A directed graph is called strongly connected if there is a path in each direction between each pair of vertices of the graph.
That is, a path exists from the first vertex in the pair to the second, and another path exists from the second vertex to the first.
 */
export class StronglyConnectedComponentsFinder {
    protected _network: Network;
    protected _time: number = 0;

    protected depthFirstSearch(atNode: Node, visitedNodes: Map<PublicKey, Time>, low: Map<PublicKey, Time>, stack: Array<PublicKey>, onStack: Map<PublicKey, boolean>, stronglyConnectedComponents: Array<StronglyConnectedComponent>) {
        //console.log(atNode.displayName + ': Visiting at time ' + this._time);
        visitedNodes.set(atNode.publicKey, this._time);
        low.set(atNode.publicKey, this._time);
        stack.push(atNode.publicKey);
        onStack.set(atNode.publicKey, true);
        //console.log(atNode.displayName + ': Low value of ' + low.get(atNode.publicKey));
        this._time++;
        QuorumSet.getAllValidators(atNode.quorumSet).forEach(
            toNodePublicKey => {
                //console.log(atNode.displayName + ': Handling neighbour ' + this._network.getNodeByPublicKey(toNodePublicKey).displayName);
                if (visitedNodes.get(toNodePublicKey) === undefined) {
                    this.depthFirstSearch(this._network.getNodeByPublicKey(toNodePublicKey), visitedNodes, low, stack, onStack, stronglyConnectedComponents);
                }
                if (onStack.get(toNodePublicKey) === true) {
                    //console.log("neighbour " + this._network.getNodeByPublicKey(toNodePublicKey).displayName + " is on the stack");
                    //console.log(atNode.displayName + ': updating low value to minimum of this low: ' + low.get(atNode.publicKey) + ' and neighbour low: ' + low.get(toNodePublicKey));
                    low.set(atNode.publicKey, Math.min(low.get(atNode.publicKey), low.get(toNodePublicKey)));
                    //console.log(atNode.displayName + ': Low value of ' + low.get(atNode.publicKey));
                } else {
                    //console.log("neighbour " + this._network.getNodeByPublicKey(toNodePublicKey).displayName + " is NOT on the stack, so we ignore its low value");
                }
            }
        );

        //console.log(atNode.displayName + ': All neighbours visited.');
        if (visitedNodes.get(atNode.publicKey) === low.get(atNode.publicKey)) {
            //console.log("strongly connected component found! Removing it from stack.");
            let stronglyConnectedComponent = new StronglyConnectedComponent();
            let isTransitiveQuorumSet = true;
            let done = false;
            while (!done) {
                let poppedNode = stack.pop();
                //console.log(poppedNode);
                onStack.set(poppedNode, false);
                stronglyConnectedComponent.nodes.add(poppedNode);


                if (poppedNode === atNode.publicKey) {
                    done = true;
                }
            }
            stronglyConnectedComponent.isTransitiveQuorumSet = this.isTransitiveQuorumSet(stronglyConnectedComponent);
            stronglyConnectedComponents.push(stronglyConnectedComponent);
        }
    }

    /*
        transitive quorumSet has no outgoing edges that are not in component
     */
    protected isTransitiveQuorumSet(stronglyConnectedComponent: StronglyConnectedComponent): boolean {
        let isTransitiveQuorumSet = true;
        stronglyConnectedComponent.nodes.forEach(publicKey => {
            let outgoingEdgesNotInComponent = QuorumSet.getAllValidators(this._network.getNodeByPublicKey(publicKey).quorumSet).filter(
                validator => !stronglyConnectedComponent.nodes.has(validator)
            );
            if(outgoingEdgesNotInComponent.length > 0)
                isTransitiveQuorumSet = false;
        });

        return isTransitiveQuorumSet;
    }

    findTarjan(network: Network): Array<StronglyConnectedComponent> {
        this._network = network;
        this._time = 0;
        let visitedNodes = new Map<PublicKey, Time>();
        let low = new Map<PublicKey, Time>();
        let stack = [];
        let onStack = new Map<PublicKey, boolean>();
        let stronglyConnectedComponents: Array<StronglyConnectedComponent> = [];

        for (let i = 0; i < network.nodes.length; i++) {
            if (visitedNodes.get(network.nodes[i].publicKey) === undefined) {
                this.depthFirstSearch(network.nodes[i], visitedNodes, low, stack, onStack, stronglyConnectedComponents);
            }
        }

        return stronglyConnectedComponents;
    }
}
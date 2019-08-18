import {PublicKey} from "../network";
import {DirectedGraph, Vertex} from "./directed-graph";

type Time = number;
export type StronglyConnectedComponent = Set<PublicKey>;
/*
A directed graph is called strongly connected if there is a path in each direction between each pair of _vertices of the graph.
That is, a path exists from the first vertex in the pair to the second, and another path exists from the second vertex to the first.
 */
export class StronglyConnectedComponentsFinder {
    protected _time: number = 0;

    protected depthFirstSearch(atVertex: Vertex, graph:DirectedGraph, visitedVertices: Map<Vertex, Time>, low: Map<Vertex, Time>, stack: Array<Vertex>, onStack: Map<Vertex, boolean>, stronglyConnectedComponents: Array<StronglyConnectedComponent>) {
        visitedVertices.set(atVertex, this._time);
        low.set(atVertex, this._time);
        stack.push(atVertex);
        onStack.set(atVertex, true);
        this._time++;
        Array.from(graph.getChildren(atVertex))
            .filter(toVertex => toVertex.isValidating)
            .forEach(
                toVertex => {
                    if (visitedVertices.get(toVertex) === undefined) {
                        this.depthFirstSearch(
                            toVertex,
                            graph,
                            visitedVertices,
                            low,
                            stack,
                            onStack,
                            stronglyConnectedComponents
                        );
                    }
                    if (onStack.get(toVertex) === true) {
                        low.set(atVertex, Math.min(low.get(atVertex)!, low.get(toVertex)!));
                    }
                }
            );

        if (visitedVertices.get(atVertex) === low.get(atVertex)) {
            let stronglyConnectedComponent:StronglyConnectedComponent = new Set<PublicKey>();
            let done = false;
            while (!done) {
                let poppedNode = stack.pop()!;
                onStack.set(poppedNode, false);
                stronglyConnectedComponent.add(poppedNode.publicKey);

                if (poppedNode === atVertex) {
                    done = true;
                }
            }

            stronglyConnectedComponents.push(stronglyConnectedComponent);
        }
    }

    findTarjan(graph:DirectedGraph): Array<StronglyConnectedComponent> {
        this._time = 0;
        let visitedNodes = new Map<Vertex, Time>();
        let low = new Map<Vertex, Time>();
        let stack:Array<Vertex> = [];
        let onStack = new Map<Vertex, boolean>();
        let stronglyConnectedComponents: Array<StronglyConnectedComponent> = [];

        Array.from(graph.vertices.values()).filter(vertex => vertex.isValidating).forEach(vertex => {
            if (visitedNodes.get(vertex) === undefined) {
                this.depthFirstSearch(vertex, graph, visitedNodes, low, stack, onStack, stronglyConnectedComponents);
            }
        });

        return stronglyConnectedComponents;
    }
}
import {Node} from '../../node';
import {QuorumSet} from "../../quorum-set";
import {NetworkSimulation} from "../network-simulation";
import {Network} from "../../network";

jest.mock("../../network");

describe("network simulation", () => {
    let node:Node;
    let simulation:NetworkSimulation;
    let network: Network;
    beforeEach(()=> {
        node = new Node('localhost');
        network = new Network([node]);
        simulation = new NetworkSimulation(network);
    });

    test('updateNodeProperty', () => {
        simulation.updateNodeProperty(node, 'active', true);
        expect(network.updateNetwork).toHaveBeenCalledTimes(1);
    });

    test('updateQuorumSetProperty', () => {
        simulation.updateNodeQuorumSetProperty(node, new QuorumSet(), 'threshold', 1);
        expect(network.updateNetwork).toHaveBeenCalledTimes(1);
    })
});
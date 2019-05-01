import {AvailabilityIndex,Node} from "../../../src";

let node1 = new Node('localhost', 20, 'a');

test('get', () => {
    node1.statistics.activeCounter = 300;
    expect(AvailabilityIndex.get(node1)).toEqual(1);
    node1.statistics.activeCounter = 150;
    expect(AvailabilityIndex.get(node1)).toEqual(0.5);
    node1.statistics.activeCounter = 0;
    expect(AvailabilityIndex.get(node1)).toEqual(0);
});
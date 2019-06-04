import {ActiveIndex,Node} from "../../../src";

let node1 = new Node('localhost', 20, 'a');

test('get', () => {
    node1.statistics.active7DaysPercentage = 100;
    expect(ActiveIndex.get(node1)).toEqual(1);
    node1.statistics.active7DaysPercentage = 50;
    expect(ActiveIndex.get(node1)).toEqual(0.5);
});
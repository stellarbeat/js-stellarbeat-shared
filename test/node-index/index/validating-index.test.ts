import {ValidatingIndex,Node} from "../../../src";

let node1 = new Node('a');

test('get', () => {
    node1.statistics.validating30DaysPercentage = 100;
    expect(ValidatingIndex.get(node1)).toEqual(1);
    node1.statistics.validating30DaysPercentage = 50;
    expect(ValidatingIndex.get(node1)).toEqual(0.5);
});
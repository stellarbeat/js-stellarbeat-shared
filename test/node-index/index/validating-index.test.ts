import {ValidatingIndex,Node} from "../../../src";

let node1 = new Node('localhost', 20, 'a');

test('get', () => {
    node1.statistics.validating7DaysPercentage = 100;
    expect(ValidatingIndex.get(node1)).toEqual(1);
    node1.statistics.validating7DaysPercentage = 50;
    expect(ValidatingIndex.get(node1)).toEqual(0.5);
});
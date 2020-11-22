import {Node, AgeIndex} from "../../../src";

let node1 = new Node('a');

test('get', () => {
    node1.dateDiscovered = new Date();
    expect(AgeIndex.get(node1)).toEqual(0);
    let newDate = new Date();
    newDate.setMonth(newDate.getMonth() - 3);
    node1.dateDiscovered = newDate;

    expect(AgeIndex.get(node1)).toEqual(2/6);

    newDate = new Date();
    newDate.setMonth(newDate.getMonth() - 7);
    node1.dateDiscovered = newDate;
    expect(AgeIndex.get(node1)).toEqual(1);
});
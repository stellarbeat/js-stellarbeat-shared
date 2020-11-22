import {Node, TypeIndex} from "../../../src";

let node1 = new Node('a');

test('get', () => {
    expect(TypeIndex.get(node1)).toEqual(0.3);
    node1.quorumSet.validators = [node1];
    expect(TypeIndex.get(node1)).toEqual(0.7);
    node1.isFullValidator = true;
    expect(TypeIndex.get(node1)).toEqual(1);
});
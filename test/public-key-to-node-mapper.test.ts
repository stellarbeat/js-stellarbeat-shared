import {Node} from '../src'
import {getPublicKeysToNodesMap} from "../src";

test('mapper', () => {
    let node1 = new Node('localhost', 11625, "a");

    let node2 = new Node('localhost', 11625, "b");

    let nodesMap = getPublicKeysToNodesMap([node1, node2]);

    expect(nodesMap.get('a')).toEqual(node1);
    expect(nodesMap.get('b')).toEqual(node2);
});
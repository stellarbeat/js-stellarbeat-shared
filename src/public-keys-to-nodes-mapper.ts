import {Node} from './node';

export function getPublicKeysToNodesMap(nodes:Node[]):Map<string, Node> {
    let map = new Map<string, Node>();
    nodes
        .filter(node => node.publicKey)
        .map(node => map.set(node.publicKey, node));
    return map;
}
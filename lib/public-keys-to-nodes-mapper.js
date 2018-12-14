"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getPublicKeysToNodesMap(nodes) {
    let map = new Map();
    nodes
        .filter(node => node.publicKey)
        .map(node => map.set(node.publicKey, node));
    return map;
}
exports.getPublicKeysToNodesMap = getPublicKeysToNodesMap;
//# sourceMappingURL=public-keys-to-nodes-mapper.js.map
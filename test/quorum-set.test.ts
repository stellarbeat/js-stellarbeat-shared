import {Node, QuorumSet} from '../src';

let qs = new QuorumSet('a', 2, [new Node('0'), new Node('1'), new Node('2')], [
    new QuorumSet('b', 2, [new Node('4'), new Node('5')], [
        new QuorumSet('c', 2, [new Node("6"), new Node("7")])
    ]),
    new QuorumSet('d', 2, [new Node("8"), new Node("9")])
]);

test('getAllValidators', () => {
    expect(QuorumSet.getAllValidators(qs).map(node => node.publicKey)).toEqual(["0", "1", "2", "4", "5", "6", "7", "8", "9"]);
});
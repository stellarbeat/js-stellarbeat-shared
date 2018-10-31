const QuorumSet = require('../lib/quorum-set');

let qs = new QuorumSet('a', 2, [0,1, 2, 3], [
    new QuorumSet('b', 2, [4, 5], [
        new QuorumSet('c', 2, [6, 7])
    ]),
    new QuorumSet('d', 2, [8, 9])
]);

console.log(QuorumSet.getAllValidators(qs));
test('getAllValidators', () => {
    expect(QuorumSet.getAllValidators(qs)).toEqual([...Array(10).keys()]);
});
import {QuorumSet} from '../src';

let qs = new QuorumSet('a', 2, ["0","1", "2", "3"], [
    new QuorumSet('b', 2, ["4", "5"], [
        new QuorumSet('c', 2, ["6", "7"])
    ]),
    new QuorumSet('d', 2, ["8", "9"])
]);

test('getAllValidators', () => {
    expect(QuorumSet.getAllValidators(qs)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
});
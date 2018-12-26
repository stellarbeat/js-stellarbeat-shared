import {QuorumSet, QuorumService, Node} from '../src';
import * as _ from 'lodash';
QuorumService.disableCache();

test('getAllNodeCombinations', function () {
    let nodes = [1, 2, 3];
    expect(QuorumService.getAllCombinations(nodes)).toEqual([[1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]])
});

test('setEquality', function () {
        let a = new Set();
        a.add(1);
        a.add(new Set([3,4]));
        a.add(2);

        let b = new Set();
        b.add(2);
        b.add(1);
        b.add(new Set([4,3]));
        expect(_.isEqual(a,b)).toBe(true);
    }
);
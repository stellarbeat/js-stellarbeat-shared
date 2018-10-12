// 
const R = require('ramda');

class QuorumSet {


    constructor(hashKey = undefined,
                threshold = Number.MAX_SAFE_INTEGER,
                validators = [],
                innerQuorumSets = [],
                dateDiscovered = new Date(),
                dateLastSeen = new Date(),) {
        this._hashKey = hashKey;
        this._threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
        this._dateDiscovered = dateDiscovered;
        this._dateLastSeen = dateLastSeen;
    }

    hasValidators() {
        return this.validators.length > 0 || this.innerQuorumSets.length > 0;
    }

    get hashKey() {
        return this._hashKey;
    }

    set hashKey(value) {
        this._hashKey = value;
    }

    get threshold() {
        return this._threshold;
    }

    set threshold(value) {
        this._threshold = value;
    }

    get validators() {
        return this._validators;
    }

    set validators(value) {
        this._validators = value;
    }

    get innerQuorumSets() {
        return this._innerQuorumSets;
    }

    set innerQuorumSets(value) {
        this._innerQuorumSets = value;
    }

    get dateDiscovered() {
        return this._dateDiscovered;
    }

    set dateDiscovered(value) {
        this._dateDiscovered = value;
    }

    get dateLastSeen() {
        return this._dateLastSeen;
    }

    set dateLastSeen(value) {
        this._dateLastSeen = value
    }

    static getAllValidators(qs) {
        return R.reduce(
            (validators, innerQS) => R.concat(validators, QuorumSet.getAllValidators(innerQS)),
            qs.validators,
            qs.innerQuorumSets
        );
    }

    toJSON() {
        return {
            hashKey: this.hashKey,
            threshold: this.threshold,
            validators: Array.from(this.validators),
            innerQuorumSets: Array.from(this.innerQuorumSets),
            dateDiscovered: this.dateDiscovered,
            dateLastSeen: this.dateLastSeen,
        };
    }


    static fromJSON(quorumSet) {
        if(!quorumSet){
            return new QuorumSet();
        }

        let innerQuorumSets = quorumSet.innerQuorumSets.map(
            innerQuorumSet => this.fromJSON(innerQuorumSet)
        );

        return new QuorumSet(
            quorumSet.hashKey,
            quorumSet.threshold,
            quorumSet.validators,
            innerQuorumSets,
            quorumSet.dateDiscovered,
            quorumSet.dateLastSeen
        );
    };
}

module.exports = QuorumSet;

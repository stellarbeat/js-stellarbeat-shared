// @flow

class QuorumSet {

    _hashKey: ?string;
    _threshold: number;
    _validators: Array<string>;
    _innerQuorumSets: Array<QuorumSet>;

    constructor(hashKey: ?string = undefined,
                threshold: number = Number.MAX_SAFE_INTEGER,
                validators: Array<string> = [],
                innerQuorumSets: Array<QuorumSet> = []
    ) {
        this._hashKey = hashKey;
        this._threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
    }

    hasValidators() {
        return this.validators.length > 0 || this.innerQuorumSets.length > 0;
    }

    get hashKey(): ?string {
        return this._hashKey;
    }

    set hashKey(value: string): void {
        this._hashKey = value;
    }

    get threshold(): number {
        return this._threshold;
    }

    set threshold(value: number): void {
        this._threshold = value;
    }

    get validators(): Array<string> {
        return this._validators;
    }

    set validators(value: Array<string>) {
        this._validators = value;
    }

    get innerQuorumSets(): Array<QuorumSet> {
        return this._innerQuorumSets;
    }

    set innerQuorumSets(value: Array<QuorumSet>): void {
        this._innerQuorumSets = value;
    }

    static getAllValidators(qs:QuorumSet): Array<string> {
        return qs.innerQuorumSets.reduce(
            (allValidators, innerQS) => allValidators.concat(QuorumSet.getAllValidators(innerQS)),
            qs.validators
        );
    }

    toJSON(): Object {
        return {
            hashKey: this.hashKey,
            threshold: this.threshold,
            validators: Array.from(this.validators),
            innerQuorumSets: Array.from(this.innerQuorumSets)
        };
    }


    static fromJSON(quorumSet: ?Object): QuorumSet {
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
            innerQuorumSets
        );
    };
}

module.exports = QuorumSet;

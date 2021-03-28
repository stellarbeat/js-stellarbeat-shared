export class QuorumSet {

    public hashKey?: string;
    public threshold: number;
    public validators: Array<string>;
    public innerQuorumSets: Array<QuorumSet>;

    constructor(hashKey?: string,
                threshold: number = Number.MAX_SAFE_INTEGER,
                validators: Array<string> = [],
                innerQuorumSets: Array<QuorumSet> = []
    ) {
        this.hashKey = hashKey;
        this.threshold = threshold;
        this.validators = validators;
        this.innerQuorumSets = innerQuorumSets;
    }

    hasValidators() {
        return this.validators.length > 0 || this.innerQuorumSets.length > 0;
    }

    static getAllValidators(qs: QuorumSet): Array<string> {
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


    static fromJSON(quorumSet: any): QuorumSet {
        let quorumSetObject;
        if (typeof quorumSet === 'string') {
            quorumSetObject = JSON.parse(quorumSet);
        } else
            quorumSetObject = quorumSet;
        if (!quorumSetObject) {
            return new QuorumSet();
        }
        let innerQuorumSets = [];
        if (quorumSetObject.innerQuorumSets) {
            innerQuorumSets = quorumSetObject.innerQuorumSets.map(
                (innerQuorumSet: QuorumSet) => this.fromJSON(innerQuorumSet)
            );
        }
        return new QuorumSet(
            quorumSetObject.hashKey,
            quorumSetObject.threshold,
            quorumSetObject.validators,
            innerQuorumSets
        );
    };
}
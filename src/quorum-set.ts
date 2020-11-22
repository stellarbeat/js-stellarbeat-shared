import {Node} from "./node";

export class QuorumSet {

    public hashKey?: string;
    public threshold: number;
    public validators: Array<Node>;
    public innerQuorumSets: Array<QuorumSet>;

    constructor(hashKey?:string,
                threshold: number = Number.MAX_SAFE_INTEGER,
                validators: Array<Node> = [],
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

    static getAllValidators(qs:QuorumSet): Array<Node> {
        return qs.innerQuorumSets.reduce(
            (allValidators, innerQS) => allValidators.concat(QuorumSet.getAllValidators(innerQS)),
            qs.validators
        );
    }

    toJSON(): Object {
        return {
            hashKey: this.hashKey,
            threshold: this.threshold,
            validators: this.validators.map(validator => validator.publicKey),
            innerQuorumSets: this.innerQuorumSets
        };
    }
}
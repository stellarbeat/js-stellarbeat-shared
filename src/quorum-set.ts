export class QuorumSet {

    protected _hashKey?: string;
    protected _threshold: number;
    protected _validators: Array<string>;
    protected _innerQuorumSets: Array<QuorumSet>;

    constructor(hashKey:string = undefined,
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

    get hashKey(): string {
        return this._hashKey;
    }

    set hashKey(value: string) {
        this._hashKey = value;
    }

    get threshold(): number {
        return this._threshold;
    }

    set threshold(value: number) {
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

    set innerQuorumSets(value: Array<QuorumSet>) {
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


    static fromJSON(quorumSet: any): QuorumSet {
        let quorumSetObject;
        if(typeof quorumSet === 'string') {
            quorumSetObject = JSON.parse(quorumSet);
        } else
            quorumSetObject = quorumSet;
        if(!quorumSetObject){
            return new QuorumSet();
        }

        let innerQuorumSets = quorumSetObject.innerQuorumSets.map(
            innerQuorumSet => this.fromJSON(innerQuorumSet)
        );

        return new QuorumSet(
            quorumSetObject.hashKey,
            quorumSetObject.threshold,
            quorumSetObject.validators,
            innerQuorumSets
        );
    };
}
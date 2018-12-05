export declare class QuorumSet {
    protected _hashKey?: string;
    protected _threshold: number;
    protected _validators: Array<string>;
    protected _innerQuorumSets: Array<QuorumSet>;
    constructor(hashKey?: string, threshold?: number, validators?: Array<string>, innerQuorumSets?: Array<QuorumSet>);
    hasValidators(): boolean;
    hashKey: string;
    threshold: number;
    validators: Array<string>;
    innerQuorumSets: Array<QuorumSet>;
    static getAllValidators(qs: QuorumSet): Array<string>;
    toJSON(): Object;
    static fromJSON(quorumSet: any): QuorumSet;
}

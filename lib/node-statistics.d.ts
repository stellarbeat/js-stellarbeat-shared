export declare class NodeStatistics {
    _activeCounter: number;
    _overLoadedCounter: number;
    _activeInLastCrawl: boolean;
    _overLoadedInLastCrawl: boolean;
    constructor(activeCounter?: number, overLoadedCounter?: number);
    static readonly MAX_ACTIVE_COUNTER: number;
    readonly activeRating: number;
    readonly overLoadedRating: number;
    activeCounter: number;
    overLoadedCounter: number;
    activeInLastCrawl: boolean;
    overLoadedInLastCrawl: boolean;
    incrementOverLoadedCounter(): void;
    decrementOverLoadedCounter(): void;
    incrementActiveCounter(): void;
    decrementActiveCounter(): void;
    toJSON(): Object;
    static fromJSON(nodeStatistics: string | Object): NodeStatistics;
}

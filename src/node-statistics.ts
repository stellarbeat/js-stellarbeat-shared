export class NodeStatistics {
    protected _activeCounter: number;
    protected _overLoadedCounter: number;
    protected _validatingCounter: number;
    protected _activeInLastCrawl: boolean;
    protected _overLoadedInLastCrawl: boolean;
    protected _validatingInLastCrawl: boolean = false;
    protected _active7DaysPercentage: number = 0;
    protected _overLoaded7DaysPercentage: number = 0;
    protected _validating7DaysPercentage: number = 0;
    protected _active24HoursPercentage: number = 0;
    protected _overLoaded24HoursPercentage: number = 0;
    protected _validating24HoursPercentage: number = 0;


    constructor(activeCounter: number = 0, overLoadedCounter:number = 0, validatingCounter: number = 0) {
        this._activeCounter = activeCounter;
        this._overLoadedCounter = overLoadedCounter;
        this._activeInLastCrawl = false;
        this._overLoadedInLastCrawl = false;
        this._validatingCounter = validatingCounter;
    }

    static get MAX_ACTIVE_COUNTER() {
        return 300;
    }

    get activeRating() {
        let divider = NodeStatistics.MAX_ACTIVE_COUNTER / 5; // 5 star ratings
        let rating = this.activeCounter/divider;

        return Math.ceil(rating);
    }

    get overLoadedRating() {
        let divider = NodeStatistics.MAX_ACTIVE_COUNTER / 5; // 5 star ratings
        let rating = this.overLoadedCounter/divider;

        return Math.ceil(rating);
    }

    get validatingRating() {
        let divider = NodeStatistics.MAX_ACTIVE_COUNTER / 5; // 5 star ratings
        let rating = this.validatingCounter/divider;

        return Math.ceil(rating);
    }

    get activeCounter(): number {
        return this._activeCounter;
    }

    set activeCounter(value: number) {
        this._activeCounter = value;
    }

    get overLoadedCounter(): number {
        return this._overLoadedCounter;
    }

    set overLoadedCounter(value: number) {
        this._overLoadedCounter = value;
    }

    get activeInLastCrawl() {
        return this._activeInLastCrawl;
    }

    set activeInLastCrawl(value:boolean) {
        this._activeInLastCrawl = value;
    }

    get overLoadedInLastCrawl() {
        return this._overLoadedInLastCrawl;
    }

    set overLoadedInLastCrawl(value:boolean) {
        this._overLoadedInLastCrawl = value;
    }

    get validatingCounter(): number {
        return this._validatingCounter;
    }

    set validatingCounter(value: number) {
        this._validatingCounter = value;
    }

    get validatingInLastCrawl(): boolean {
        return this._validatingInLastCrawl;
    }

    set validatingInLastCrawl(value: boolean) {
        this._validatingInLastCrawl = value;
    }

    incrementOverLoadedCounter() {
        if(this._overLoadedCounter < NodeStatistics.MAX_ACTIVE_COUNTER) { //if crawler runs every 15 minutes, it takes about 3 days to become non active
            this._overLoadedCounter ++;
        }
    }

    decrementOverLoadedCounter() {
        if(this._overLoadedCounter > 0) {
            this.overLoadedCounter --;
        }
    }

    incrementActiveCounter() {
        if(this._activeCounter < NodeStatistics.MAX_ACTIVE_COUNTER) { //if crawler runs every 15 minutes, it takes about 3 days to become non active
            this._activeCounter ++;
        }
    }

    decrementActiveCounter() {
        if(this._activeCounter > 0) {
            this._activeCounter --;
        }
    }

    incrementValidatingCounter() {
        if(this._validatingCounter < NodeStatistics.MAX_ACTIVE_COUNTER) { //if crawler runs every 15 minutes, it takes about 3 days to become non active
            this._validatingCounter ++;
        }
    }

    decrementValidatingCounter() {
        if(this._validatingCounter > 0) {
            this._validatingCounter --;
        }
    }

    get active7DaysPercentage(): number {
        return this._active7DaysPercentage;
    }

    set active7DaysPercentage(value: number) {
        this._active7DaysPercentage = value;
    }

    get overLoaded7DaysPercentage(): number {
        return this._overLoaded7DaysPercentage;
    }

    set overLoaded7DaysPercentage(value: number) {
        this._overLoaded7DaysPercentage = value;
    }

    get validating7DaysPercentage(): number {
        return this._validating7DaysPercentage;
    }

    set validating7DaysPercentage(value: number) {
        this._validating7DaysPercentage = value;
    }

    get active24HoursPercentage(): number {
        return this._active24HoursPercentage;
    }

    set active24HoursPercentage(value: number) {
        this._active24HoursPercentage = value;
    }

    get overLoaded24HoursPercentage(): number {
        return this._overLoaded24HoursPercentage;
    }

    set overLoaded24HoursPercentage(value: number) {
        this._overLoaded24HoursPercentage = value;
    }

    get validating24HoursPercentage(): number {
        return this._validating24HoursPercentage;
    }

    set validating24HoursPercentage(value: number) {
        this._validating24HoursPercentage = value;
    }

    toJSON():Object {
        return {
            activeCounter: this.activeCounter,
            overLoadedCounter: this.overLoadedCounter,
            activeRating: this.activeRating,
            activeInLastCrawl: this.activeInLastCrawl,
            overLoadedInLastCrawl: this.overLoadedInLastCrawl,
            validatingInLastCrawl: this.validatingInLastCrawl,
            validatingCounter: this.validatingCounter,
            validatingRating: this.validatingRating,
            active7DaysPercentage: this.active7DaysPercentage,
            overLoaded7DaysPercentage: this.overLoaded7DaysPercentage,
            validating7DaysPercentage: this.validating7DaysPercentage,
            active24HoursPercentage: this.active24HoursPercentage,
            overLoaded24HoursPercentage: this.overLoaded24HoursPercentage,
            validating24HoursPercentage: this.validating24HoursPercentage
        };
    };

    static fromJSON(nodeStatistics:string|Object):NodeStatistics {
        if(nodeStatistics === undefined) {
            return new NodeStatistics();
        }

        let nodeStatisticsObject;
        if(typeof nodeStatistics === 'string') {
            nodeStatisticsObject = JSON.parse(nodeStatistics);
        } else
            nodeStatisticsObject = nodeStatistics;

        let newNodeStatistics = new NodeStatistics();
        newNodeStatistics.activeCounter = nodeStatisticsObject.activeCounter;
        newNodeStatistics.overLoadedCounter = nodeStatisticsObject.overLoadedCounter;
        if(nodeStatisticsObject.overLoadedInLastCrawl !== undefined && nodeStatisticsObject.overLoadedInLastCrawl !== null)
            newNodeStatistics.overLoadedInLastCrawl = nodeStatisticsObject.overLoadedInLastCrawl;
        if(nodeStatisticsObject.activeInLastCrawl !== undefined && nodeStatisticsObject.activeInLastCrawl !== null)
            newNodeStatistics.activeInLastCrawl = nodeStatisticsObject.activeInLastCrawl;

        if(nodeStatisticsObject.validatingInLastCrawl !== undefined && nodeStatisticsObject.validatingInLastCrawl !== null)
            newNodeStatistics.validatingInLastCrawl = nodeStatisticsObject.validatingInLastCrawl;

        if(nodeStatisticsObject.validatingCounter !== undefined && nodeStatisticsObject.validatingCounter !== null)
            newNodeStatistics.validatingCounter = nodeStatisticsObject.validatingCounter;

        if(nodeStatisticsObject.active7DaysPercentage)
            newNodeStatistics.active7DaysPercentage = nodeStatisticsObject.active7DaysPercentage;
        if(nodeStatisticsObject.overLoaded7DaysPercentage)
            newNodeStatistics.overLoaded7DaysPercentage = nodeStatisticsObject.overLoaded7DaysPercentage;
        if(nodeStatisticsObject.validating7DaysPercentage)
            newNodeStatistics.validating7DaysPercentage = nodeStatisticsObject.validating7DaysPercentage;
        if(nodeStatisticsObject.active24HoursPercentage)
            newNodeStatistics.active24HoursPercentage = nodeStatisticsObject.active24HoursPercentage;
        if(nodeStatisticsObject.overLoaded24HoursPercentage)
            newNodeStatistics.overLoaded24HoursPercentage = nodeStatisticsObject.overLoaded24HoursPercentage;
        if(nodeStatisticsObject.validating24HoursPercentage)
            newNodeStatistics.validating24HoursPercentage = nodeStatisticsObject.validating24HoursPercentage;

        return newNodeStatistics;
    }
}
// @flow

class NodeStatistics {
    //todo: store measurement time series for 24h results, monthly results,...?
    _activeCounter: number;
    _overLoadedCounter: number;
    _activeInLastCrawl: boolean;
    _overLoadedInLastCrawl: boolean;

    constructor(activeCounter: number = 0, overLoadedCounter:number = 0) {
        this._activeCounter = activeCounter;
        this._overLoadedCounter = overLoadedCounter;
        this._activeInLastCrawl = false;
        this._overLoadedInLastCrawl = false;
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

    toJSON():Object {
        return {
            activeCounter: this.activeCounter,
            overLoadedCounter: this.overLoadedCounter,
            activeRating: this.activeRating,
            activeInLastCrawl: this.activeInLastCrawl,
            overLoadedInLastCrawl: this.overLoadedInLastCrawl
        };
    };

    static fromJSON(nodeStatistics:string|Object):NodeStatistics {
        if(nodeStatistics === undefined) {
            return new NodeStatistics();
        }

        let nodeStatisticsObject;
        if((typeof nodeStatistics) === 'string') {
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

        return newNodeStatistics;
    }
}

module.exports = NodeStatistics;
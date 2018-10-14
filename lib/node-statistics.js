// 

class NodeStatistics {


    constructor(activeCounter = 0) {
        this._activeCounter = activeCounter;
    }

    static get MAX_ACTIVE_COUNTER() {
        return 300;
    }

    get activeRating() {
        let divider = NodeStatistics.MAX_ACTIVE_COUNTER / 5; // 5 star ratings
        let rating = this.activeCounter/divider;

        return Math.ceil(rating);
    }

    get activeCounter() {
        return this._activeCounter;
    }

    set activeCounter(value) {
        this._activeCounter = value;
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

    toJSON() {
        return {
            activeCounter: this.activeCounter,
            activeRating: this.activeRating
        };
    };

    static fromJSON(nodeStatistics) {
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

        return newNodeStatistics;
    }
}

module.exports = NodeStatistics;
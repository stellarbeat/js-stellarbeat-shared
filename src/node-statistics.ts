export type TimeBucketAverages = {
    date: Date,
    percentage: number
}

export class NodeStatistics {
    public activeInLastCrawl: boolean = false;
    public overLoadedInLastCrawl: boolean = false;
    public validatingInLastCrawl: boolean = false;
    public active30DaysPercentage: number = 0;
    public overLoaded30DaysPercentage: number = 0;
    public validating30DaysPercentage: number = 0;
    public active24HoursPercentage: number = 0;
    public overLoaded24HoursPercentage: number = 0;
    public validating24HoursPercentage: number = 0;
    public validating30DayBuckets: TimeBucketAverages[] = [];
    public validating24HourBuckets: TimeBucketAverages[] = [];

    toJSON():Object {
        return {
            activeInLastCrawl: this.activeInLastCrawl,
            overLoadedInLastCrawl: this.overLoadedInLastCrawl,
            validatingInLastCrawl: this.validatingInLastCrawl,
            active30DaysPercentage: this.active30DaysPercentage,
            overLoaded30DaysPercentage: this.overLoaded30DaysPercentage,
            validating30DaysPercentage: this.validating30DaysPercentage,
            active24HoursPercentage: this.active24HoursPercentage,
            overLoaded24HoursPercentage: this.overLoaded24HoursPercentage,
            validating24HoursPercentage: this.validating24HoursPercentage,
            validating30DayBuckets: this.validating30DayBuckets,
            validating24HourBuckets: this.validating24HourBuckets
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
        if(nodeStatisticsObject.overLoadedInLastCrawl !== undefined && nodeStatisticsObject.overLoadedInLastCrawl !== null)
            newNodeStatistics.overLoadedInLastCrawl = nodeStatisticsObject.overLoadedInLastCrawl;
        if(nodeStatisticsObject.activeInLastCrawl !== undefined && nodeStatisticsObject.activeInLastCrawl !== null)
            newNodeStatistics.activeInLastCrawl = nodeStatisticsObject.activeInLastCrawl;

        if(nodeStatisticsObject.validatingInLastCrawl !== undefined && nodeStatisticsObject.validatingInLastCrawl !== null)
            newNodeStatistics.validatingInLastCrawl = nodeStatisticsObject.validatingInLastCrawl;

        if(nodeStatisticsObject.active30DaysPercentage)
            newNodeStatistics.active30DaysPercentage = nodeStatisticsObject.active30DaysPercentage;
        if(nodeStatisticsObject.overLoaded30DaysPercentage)
            newNodeStatistics.overLoaded30DaysPercentage = nodeStatisticsObject.overLoaded30DaysPercentage;
        if(nodeStatisticsObject.validating30DaysPercentage)
            newNodeStatistics.validating30DaysPercentage = nodeStatisticsObject.validating30DaysPercentage;
        if(nodeStatisticsObject.active24HoursPercentage)
            newNodeStatistics.active24HoursPercentage = nodeStatisticsObject.active24HoursPercentage;
        if(nodeStatisticsObject.overLoaded24HoursPercentage)
            newNodeStatistics.overLoaded24HoursPercentage = nodeStatisticsObject.overLoaded24HoursPercentage;
        if(nodeStatisticsObject.validating24HoursPercentage)
            newNodeStatistics.validating24HoursPercentage = nodeStatisticsObject.validating24HoursPercentage;

        if(nodeStatisticsObject.validating24HourBuckets)
            newNodeStatistics.validating24HourBuckets = nodeStatisticsObject.validating24HourBuckets;
        if(nodeStatisticsObject.validating30DayBuckets)
            newNodeStatistics.validating30DayBuckets = nodeStatisticsObject.validating30DayBuckets;

        return newNodeStatistics;
    }
}
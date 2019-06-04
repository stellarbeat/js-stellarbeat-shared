export class NodeStatistics {
    protected _activeInLastCrawl: boolean = false;
    protected _overLoadedInLastCrawl: boolean = false;
    protected _validatingInLastCrawl: boolean = false;
    protected _active7DaysPercentage: number = 0;
    protected _overLoaded7DaysPercentage: number = 0;
    protected _validating7DaysPercentage: number = 0;
    protected _active24HoursPercentage: number = 0;
    protected _overLoaded24HoursPercentage: number = 0;
    protected _validating24HoursPercentage: number = 0;

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

    get validatingInLastCrawl(): boolean {
        return this._validatingInLastCrawl;
    }

    set validatingInLastCrawl(value: boolean) {
        this._validatingInLastCrawl = value;
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
            activeInLastCrawl: this.activeInLastCrawl,
            overLoadedInLastCrawl: this.overLoadedInLastCrawl,
            validatingInLastCrawl: this.validatingInLastCrawl,
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
        if(nodeStatisticsObject.overLoadedInLastCrawl !== undefined && nodeStatisticsObject.overLoadedInLastCrawl !== null)
            newNodeStatistics.overLoadedInLastCrawl = nodeStatisticsObject.overLoadedInLastCrawl;
        if(nodeStatisticsObject.activeInLastCrawl !== undefined && nodeStatisticsObject.activeInLastCrawl !== null)
            newNodeStatistics.activeInLastCrawl = nodeStatisticsObject.activeInLastCrawl;

        if(nodeStatisticsObject.validatingInLastCrawl !== undefined && nodeStatisticsObject.validatingInLastCrawl !== null)
            newNodeStatistics.validatingInLastCrawl = nodeStatisticsObject.validatingInLastCrawl;

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
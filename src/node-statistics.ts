export class NodeStatistics {
    protected _activeInLastCrawl: boolean = false;
    protected _overLoadedInLastCrawl: boolean = false;
    protected _validatingInLastCrawl: boolean = false;
    protected _active30DaysPercentage: number = 0;
    protected _overLoaded30DaysPercentage: number = 0;
    protected _validating30DaysPercentage: number = 0;
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

    get active30DaysPercentage(): number {
        return this._active30DaysPercentage;
    }

    set active30DaysPercentage(value: number) {
        this._active30DaysPercentage = value;
    }

    get overLoaded30DaysPercentage(): number {
        return this._overLoaded30DaysPercentage;
    }

    set overLoaded30DaysPercentage(value: number) {
        this._overLoaded30DaysPercentage = value;
    }

    get validating30DaysPercentage(): number {
        return this._validating30DaysPercentage;
    }

    set validating30DaysPercentage(value: number) {
        this._validating30DaysPercentage = value;
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
            active30DaysPercentage: this.active30DaysPercentage,
            overLoaded30DaysPercentage: this.overLoaded30DaysPercentage,
            validating30DaysPercentage: this.validating30DaysPercentage,
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

        return newNodeStatistics;
    }
}
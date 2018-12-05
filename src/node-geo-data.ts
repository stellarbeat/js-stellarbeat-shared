export class NodeGeoData {
    _countryCode?:string;
    _countryName?:string;
    _regionCode?:string;
    _regionName?:string;
    _city?:string;
    _zipCode?:string;
    _timeZone?:string;
    _latitude?:number;
    _longitude?:number;
    _metroCode?:string;

    get countryCode():string {
        return this._countryCode;
    }

    set countryCode(value: string) {
        this._countryCode = value;
    }

    get countryName():string {
        return this._countryName;
    }

    set countryName(value: string) {
        this._countryName = value;
    }

    get regionCode():string {
        return this._regionCode;
    }

    set regionCode(value: string) {
        this._regionCode = value;
    }

    get regionName():string {
        return this._regionName;
    }

    set regionName(value: string) {
        this._regionName = value;
    }

    get city():string {
        return this._city;
    }

    set city(value: string) {
        this._city = value;
    }

    get zipCode():string {
        return this._zipCode;
    }

    set zipCode(value: string) {
        this._zipCode = value;
    }

    get timeZone():string {
        return this._timeZone;
    }

    set timeZone(value: string) {
        this._timeZone = value;
    }

    get latitude():number {
        return this._latitude;
    }

    set latitude(value: number) {
        this._latitude = value;
    }

    get longitude():number {
        return this._longitude;
    }

    set longitude(value: number) {
        this._longitude = value;
    }

    get metroCode():string {
        return this._metroCode;
    }

    set metroCode(value: string) {
        this._metroCode = value;
    }

    toJSON():Object {
        return {
            countryCode: this.countryCode,
            countryName: this.countryName,
            regionCode: this.regionCode,
            regionName: this.regionName,
            city: this.city,
            zipCode: this.zipCode,
            timeZone: this.timeZone,
            latitude: this.latitude,
            longitude: this.longitude,
            metroCode: this.metroCode,
        };
    };

    static fromJSON(nodeGeo:string|Object):NodeGeoData {
        if(nodeGeo === undefined){
            return new NodeGeoData();
        }
        let nodeGeoObject;
        if(typeof nodeGeo === 'string') {
            nodeGeoObject = JSON.parse(nodeGeo);
        } else
            nodeGeoObject = nodeGeo;

        let newNodeGeo = new NodeGeoData();
        newNodeGeo.countryCode = nodeGeoObject.countryCode;
        newNodeGeo.countryName = nodeGeoObject.countryName;
        newNodeGeo.regionCode = nodeGeoObject.regionCode;
        newNodeGeo.regionName = nodeGeoObject.regionName;
        newNodeGeo.city = nodeGeoObject.city;
        newNodeGeo.zipCode = nodeGeoObject.zipCode;
        newNodeGeo.timeZone = nodeGeoObject.timeZone;
        newNodeGeo.latitude = nodeGeoObject.latitude;
        newNodeGeo.longitude = nodeGeoObject.longitude;
        newNodeGeo.metroCode = nodeGeoObject.metroCode;

        return newNodeGeo;
    }
}
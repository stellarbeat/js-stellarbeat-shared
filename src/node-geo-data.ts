export class NodeGeoData {
    public countryCode?:string;
    public countryName?:string;
    public regionCode?:string;
    public regionName?:string;
    public city?:string;
    public zipCode?:string;
    public timeZone?:string;
    public latitude?:number;
    public longitude?:number;
    public metroCode?:string;

    /*
    @Deprecated
     */
    public dateUpdated!: Date;

    constructor(dateUpdated?: Date) {
        if(!dateUpdated)
            this.dateUpdated = new Date();
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
            dateUpdated: this.dateUpdated
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
        if(nodeGeoObject.dateUpdated)
            newNodeGeo.dateUpdated = new Date(nodeGeoObject.dateUpdated);

        return newNodeGeo;
    }
}
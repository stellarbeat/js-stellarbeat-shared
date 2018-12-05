"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NodeGeoData {
    get countryCode() {
        return this._countryCode;
    }
    set countryCode(value) {
        this._countryCode = value;
    }
    get countryName() {
        return this._countryName;
    }
    set countryName(value) {
        this._countryName = value;
    }
    get regionCode() {
        return this._regionCode;
    }
    set regionCode(value) {
        this._regionCode = value;
    }
    get regionName() {
        return this._regionName;
    }
    set regionName(value) {
        this._regionName = value;
    }
    get city() {
        return this._city;
    }
    set city(value) {
        this._city = value;
    }
    get zipCode() {
        return this._zipCode;
    }
    set zipCode(value) {
        this._zipCode = value;
    }
    get timeZone() {
        return this._timeZone;
    }
    set timeZone(value) {
        this._timeZone = value;
    }
    get latitude() {
        return this._latitude;
    }
    set latitude(value) {
        this._latitude = value;
    }
    get longitude() {
        return this._longitude;
    }
    set longitude(value) {
        this._longitude = value;
    }
    get metroCode() {
        return this._metroCode;
    }
    set metroCode(value) {
        this._metroCode = value;
    }
    toJSON() {
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
    }
    ;
    static fromJSON(nodeGeo) {
        if (nodeGeo === undefined) {
            return new NodeGeoData();
        }
        let nodeGeoObject;
        if (typeof nodeGeo === 'string') {
            nodeGeoObject = JSON.parse(nodeGeo);
        }
        else
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
exports.NodeGeoData = NodeGeoData;
//# sourceMappingURL=node-geo-data.js.map
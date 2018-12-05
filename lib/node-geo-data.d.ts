export declare class NodeGeoData {
    _countryCode?: string;
    _countryName?: string;
    _regionCode?: string;
    _regionName?: string;
    _city?: string;
    _zipCode?: string;
    _timeZone?: string;
    _latitude?: number;
    _longitude?: number;
    _metroCode?: string;
    countryCode: string;
    countryName: string;
    regionCode: string;
    regionName: string;
    city: string;
    zipCode: string;
    timeZone: string;
    latitude: number;
    longitude: number;
    metroCode: string;
    toJSON(): Object;
    static fromJSON(nodeGeo: string | Object): NodeGeoData;
}

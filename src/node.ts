import {NodeGeoData} from "./node-geo-data";
import {NodeStatistics} from "./node-statistics";
import {QuorumSet} from "./quorum-set";
import {Organization} from "./organization";

export class Node {
    public ip:string;
    public port:number;
    public publicKey:string;
    public name?:string;
    public host?:string;
    public ledgerVersion?:string;
    public overlayVersion?:string;
    public overlayMinVersion?:string;
    public networkId?:string;
    public versionStr?:string;
    public quorumSet: QuorumSet = new QuorumSet();
    public active: boolean = false;
    public geoData: NodeGeoData = new NodeGeoData();
    public statistics: NodeStatistics = new NodeStatistics();
    public dateDiscovered: Date = new Date();
    public dateUpdated: Date = new Date();
    public overLoaded: boolean = false;
    public isFullValidator: boolean = false;
    protected _isValidator: boolean = false;
    public isValidating: boolean = false;
    public homeDomain?:string;
    public index: number = 0.0;
    public historyUrl?: string;
    public alias?: string;
    public isp?: string;
    public organization?: Organization;

    constructor(publicKey:string, ip:string = '127.0.0.1', port:number = 11625) {
        this.ip = ip;
        this.port = port;
        this.publicKey = publicKey;
    }

    get displayName() {
        if(this.name) {
            return this.name;
        }

        if(this.publicKey)
            return this.publicKey.substr(0, 10) + '...' + this.publicKey.substr(50, 100);

        return '';
    }

    get key() {
        return this.ip + ":" + this.port;
    }

    get isValidator(): boolean {
        if(!this._isValidator)
            return this.isValidating || this.quorumSet.hasValidators();

        return this._isValidator;
    }

    set isValidator(value:boolean) {
        this._isValidator = value
    }

    toJSON():Object {
        return {
            ip: this.ip,
            port: this.port,
            host: this.host,
            publicKey: this.publicKey,
            name: this.name,
            ledgerVersion: this.ledgerVersion,
            overlayVersion: this.overlayVersion,
            overlayMinVersion: this.overlayMinVersion,
            networkId: this.networkId,
            versionStr: this.versionStr,
            active: this.active,
            overLoaded: this.overLoaded,
            quorumSet: this.quorumSet,
            geoData: this.geoData,
            statistics: this.statistics,
            dateDiscovered: this.dateDiscovered,
            dateUpdated: this.dateUpdated,
            isValidator: this.isValidator,
            isFullValidator: this.isFullValidator,
            isValidating: this.isValidating,
            index: this.index,
            homeDomain: this.homeDomain,
            organizationId: this.organization ? this.organization.id : undefined,
            historyUrl: this.historyUrl,
            alias: this.alias,
            isp: this.isp
        };
    };

    toString(){
        return `Node (key: ${this.key}, publicKey: ${this.publicKey})`;
    }
}
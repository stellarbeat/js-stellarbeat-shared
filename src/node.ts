import {NodeGeoData} from "./node-geo-data";
import {NodeStatistics} from "./node-statistics";
import {QuorumSet} from "./quorum-set";
import {OrganizationId} from "./network";

export class Node {
    public ip:string;
    public port:number;
    public publicKey?:string;
    public name?:string;
    public host?:string;
    public ledgerVersion?:string;
    public overlayVersion?:string;
    public overlayMinVersion?:string;
    public networkId?:string;
    public versionStr?:string;
    public quorumSet: QuorumSet;
    public active: boolean;
    public geoData: NodeGeoData;
    public statistics: NodeStatistics;
    public dateDiscovered: Date;
    public dateUpdated: Date;
    public overLoaded: boolean;
    public isFullValidator: boolean = false;
    protected _isValidator: boolean = false;
    public isValidating: boolean = false;
    public homeDomain?:string;
    public index: number = 0.0;
    public historyUrl?: string;
    public alias?: string;
    public isp?: string;
    public organizationId?:OrganizationId;

    constructor(ip:string, port:number = 11625, publicKey:string|undefined = undefined, active:boolean = false, overLoaded:boolean = false, quorumSet:QuorumSet = new QuorumSet(), geoData = new NodeGeoData(), statistics = new NodeStatistics(), dateDiscovered:Date = new Date(), dateUpdated:Date = new Date() ) {
        this.ip = ip;
        this.port = port;
        this.publicKey = publicKey;
        this.quorumSet = quorumSet;
        this.geoData = geoData;
        this.statistics = statistics;
        this.active = active;
        this.overLoaded = overLoaded;
        this.dateDiscovered = dateDiscovered;
        this.dateUpdated = dateUpdated;
    }

    get displayName() {
        if(this.name) {
            return this.name;
        }

        if(this.publicKey)
            return this.publicKey;

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
            organizationId: this.organizationId,
            historyUrl: this.historyUrl,
            alias: this.alias,
            isp: this.isp
        };
    };

    static fromJSON(node:string|Object):Node {
        let nodeObject:any;
        if(typeof node === 'string') {
            nodeObject = JSON.parse(node);
        } else
            nodeObject = node;

        let newNode = new Node(nodeObject.ip, nodeObject.port, nodeObject.publicKey);
        newNode.ledgerVersion = nodeObject.ledgerVersion;
        newNode.overlayVersion = nodeObject.overlayVersion;
        newNode.overlayMinVersion = nodeObject.overlayMinVersion;
        newNode.networkId = nodeObject.networkId;
        newNode.versionStr = nodeObject.versionStr;
        newNode.active = nodeObject.active;
        newNode.overLoaded = nodeObject.overLoaded;
        newNode.quorumSet = QuorumSet.fromJSON(nodeObject.quorumSet);
        newNode.geoData = NodeGeoData.fromJSON(nodeObject.geoData);
        newNode.statistics = NodeStatistics.fromJSON(nodeObject.statistics);
        newNode.name = nodeObject.name;
        newNode.host = nodeObject.host;
        newNode.dateDiscovered = new Date(nodeObject.dateDiscovered);
        newNode.dateUpdated = new Date(nodeObject.dateUpdated);
        if(nodeObject.isFullValidator !== undefined)
            newNode.isFullValidator = nodeObject.isFullValidator;
        if(nodeObject.index !== undefined)
            newNode.index = nodeObject.index;
        newNode.homeDomain = nodeObject.homeDomain;
        newNode.isValidating = nodeObject.isValidating;
        newNode.organizationId = nodeObject.organizationId;
        newNode.historyUrl = nodeObject.historyUrl;
        newNode.alias = nodeObject.alias;
        newNode.isp = nodeObject.isp;

        return newNode;
    }

    toString(){
        return `Node (key: ${this.key}, publicKey: ${this.publicKey})`;
    }
}
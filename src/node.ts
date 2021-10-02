import {NodeGeoData} from "./node-geo-data";
import {NodeStatistics} from "./node-statistics";
import {QuorumSet} from "./quorum-set";
import PropertyMapper from "./PropertyMapper";

export class Node {
    public ip:string;
    public port:number;
    public publicKey:string;
    public name:string|null = null;
    public host:string|null = null;
    public ledgerVersion:number|null = null;
    public overlayVersion:number|null = null;
    public overlayMinVersion:number|null = null;
    public networkId:string|null = null;
    public versionStr:string|null = null;
    public quorumSet: QuorumSet = new QuorumSet();
    public quorumSetHashKey: string|null = null;
    public active: boolean = false;
    public activeInScp: boolean = false;
    public geoData: NodeGeoData = new NodeGeoData();
    public statistics: NodeStatistics = new NodeStatistics();
    public dateDiscovered: Date = new Date();
    public dateUpdated: Date = new Date();
    public overLoaded: boolean = false;
    public isFullValidator: boolean = false;
    public isValidating: boolean = false;
    public homeDomain?:string;
    public index: number = 0.0;
    public historyUrl: string|null = null;
    public alias: string|null = null;
    public isp: string|null = null;
    public organizationId: string|null = null;
    public unknown:boolean = false; //a node is unknown if it is not crawled or maybe archived

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
        return this.isValidating || this.quorumSet.hasValidators();
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
            activeInScp: this.activeInScp,
            overLoaded: this.overLoaded,
            quorumSet: this.quorumSet,
            quorumSetHashKey: this.quorumSetHashKey,
            geoData: this.geoData,
            statistics: this.statistics,
            dateDiscovered: this.dateDiscovered,
            dateUpdated: this.dateUpdated,
            isFullValidator: this.isFullValidator,
            isValidating: this.isValidating,
            isValidator: this.isValidator,
            index: this.index,
            homeDomain: this.homeDomain,
            organizationId: this.organizationId,
            historyUrl: this.historyUrl,
            alias: this.alias,
            isp: this.isp
        };
    };

    toString(){
        return `Node (key: ${this.key}, publicKey: ${this.publicKey})`;
    }

    static fromJSON(nodeJSON:string|Object):Node {
        let nodeDTO:any;
        if(typeof nodeJSON === 'string') {
            nodeDTO = JSON.parse(nodeJSON);
        } else
            nodeDTO = nodeJSON;

        if (!nodeDTO.publicKey) {
            throw new Error("nodeDTO missing public key");
        }

        let node = new Node(nodeDTO.publicKey);
        node.quorumSet = QuorumSet.fromJSON(nodeDTO.quorumSet);
        node.geoData = NodeGeoData.fromJSON(nodeDTO.geoData);
        node.statistics = NodeStatistics.fromJSON(nodeDTO.statistics);

        PropertyMapper.mapProperties(nodeDTO, node, ['publicKey', 'isValidator', 'geoData', 'quorumSet', 'statistics', 'dateDiscovered', 'dateUpdated']);
        if(nodeDTO.dateDiscovered !== undefined)
            node.dateDiscovered = new Date(nodeDTO.dateDiscovered);
        if(nodeDTO.dateUpdated !== undefined)
            node.dateUpdated = new Date(nodeDTO.dateUpdated);

        return node;
    }
}
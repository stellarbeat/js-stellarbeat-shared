import {NodeGeoData} from "./node-geo-data";
import {NodeStatistics} from "./node-statistics";
import {QuorumSet} from "./quorum-set";

export class Node {
    protected _ip:string;
    protected _port:number;
    protected _publicKey?:string;
    protected _name?:string;
    protected _host?:string;
    protected _ledgerVersion?:string;
    protected _overlayVersion?:string;
    protected _overlayMinVersion?:string;
    protected _networkId?:string;
    protected _versionStr?:string;
    protected _quorumSet: QuorumSet;
    protected _active: boolean;
    protected _geoData: NodeGeoData;
    protected _statistics: NodeStatistics;
    protected _dateDiscovered: Date;
    protected _dateUpdated: Date;
    protected _overLoaded: boolean;
    protected _isFullValidator: boolean = false;
    protected _isValidator: boolean;
    private _isValidating: boolean = false;
    private _homeDomain?:string;
    private _index: number = 0.0;
    private _organizationId?:string;
    private _historyUrl?: string;
    private _alias?: string;
    public isp?: string;

    constructor(ip:string, port:number = 11625, publicKey:string = undefined, active:boolean = false, overLoaded:boolean = false, quorumSet:QuorumSet = new QuorumSet(), geoData = new NodeGeoData(), statistics = new NodeStatistics(), dateDiscovered:Date = new Date(), dateUpdated:Date = new Date() ) {
        this._ip = ip;
        this._port = port;
        this._publicKey = publicKey;
        this._quorumSet = quorumSet;
        this._geoData = geoData;
        this._statistics = statistics;
        this._active = active;
        this._overLoaded = overLoaded;
        this._dateDiscovered = dateDiscovered;
        this._dateUpdated = dateUpdated;
    }

    get displayName() {
        if(this.name) {
            return this.name;
        }

        return this.publicKey;
    }

    get active(): boolean {
        return this._active;
    }

    set active(value: boolean) {
        this._active = value;
    }

    get overLoaded(): boolean {
        return this._overLoaded;
    }

    set overLoaded(value: boolean) {
        this._overLoaded = value;
    }

    get key() {
        return this._ip + ":" + this._port;
    }

    get ip() {
        return this._ip;
    }

    set ip(value:string) {
        this._ip = value;
    }

    get port() {
        return this._port;
    }

    set port(value:number) {
        this._port = value;
    }

    get publicKey() {
        return this._publicKey;
    }

    set publicKey(value:string) {
        this._publicKey = value;
    }

    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get host(): string {
        return this._host;
    }

    set host(value: string) {
        this._host = value;
    }

    get ledgerVersion() {
        return this._ledgerVersion;
    }

    set ledgerVersion(value:string) {
        this._ledgerVersion = value;
    }

    get overlayVersion() {
        return this._overlayVersion;
    }

    set overlayVersion(value:string) {
        this._overlayVersion = value;
    }

    get overlayMinVersion() {
        return this._overlayMinVersion;
    }

    set overlayMinVersion(value:string) {
        this._overlayMinVersion = value;
    }

    get networkId() {
        return this._networkId;
    }

    set networkId(value:string) {
        this._networkId = value;
    }

    get versionStr() {
        return this._versionStr;
    }

    set versionStr(value:string) {
        this._versionStr = value;
    }

    get quorumSet(){
        return this._quorumSet;
    }

    set quorumSet(value:QuorumSet) {
        this._quorumSet = value;
    }

    get geoData(): NodeGeoData {
        return this._geoData;
    }

    set geoData(value: NodeGeoData) {
        this._geoData = value;
    }

    get statistics() {
        return this._statistics;
    }

    set statistics(value: NodeStatistics) {
        this._statistics = value;
    }

    get dateDiscovered(): Date {
        return this._dateDiscovered;
    }

    set dateDiscovered(value: Date) {
        this._dateDiscovered = value;
    }

    get dateUpdated(): Date {
        return this._dateUpdated;
    }

    set dateUpdated(value: Date) {
        this._dateUpdated = value;
    }

    get isFullValidator(): boolean {
        return this._isFullValidator;
    }

    set isFullValidator(value: boolean) {
        this._isFullValidator = value;
    }

    get isValidator(): boolean {
        if(this._isValidator === undefined)
            return this.isValidating || this.quorumSet.hasValidators();

        return this._isValidator;
    }

    set isValidator(value:boolean) {
        this._isValidator = value
    }

    get index(): number {
        return this._index;
    }

    set index(value: number) {
        this._index = value;
    }

    get homeDomain(): string {
        return this._homeDomain;
    }

    set homeDomain(value: string) {
        this._homeDomain = value;
    }

    /*
    * Node is participating in scp
     */
    get isValidating(): boolean {
        return this._isValidating;
    }

    set isValidating(value: boolean) {
        this._isValidating = value;
    }

    get organizationId() {
        return this._organizationId;
    }

    set organizationId(value) {
        this._organizationId = value;
    }

    get historyUrl() {
        return this._historyUrl;
    }

    set historyUrl(value) {
        this._historyUrl = value;
    }


    get alias() {
        return this._alias;
    }

    set alias(value) {
        this._alias = value;
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
        let nodeObject;
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
        newNode.isFullValidator = nodeObject.isFullValidator;
        newNode.index = nodeObject.index;
        newNode.homeDomain = nodeObject.homeDomain;
        newNode.isValidating = nodeObject.isValidating;
        newNode.organizationId = nodeObject.organizationId;
        newNode.historyUrl = nodeObject.historyUrl;
        newNode.alias = nodeObject.alias;
        newNode.isp = nodeObject.isp;

        return newNode;
    }
}
// @flow
const QuorumSet = require('./quorum-set');
const GeoData = require('./node-geo-data');
const Statistics = require('./node-statistics');

class Node {
    _ip:string;
    _port:number;
    _publicKey:?string;
    _name: ?string;
    _host: ?string;
    _ledgerVersion:?string;
    _overlayVersion:?string;
    _overlayMinVersion:?string;
    _networkId:?string;
    _versionStr:?string;
    _quorumSet: QuorumSet;
    _active: boolean;
    _geoData: GeoData;
    _statistics: Statistics;
    _dateDiscovered: ?Date;
    _dateUpdated: ?Date;

    constructor(ip:string, port:number, publicKey:?string = undefined, quorumSet:QuorumSet = new QuorumSet(), geoData = new GeoData(), statistics = new Statistics()) {
        this._ip = ip;
        this._port = port;
        this._publicKey = publicKey;
        this._quorumSet = quorumSet;
        this._geoData = geoData;
        this._statistics = statistics;
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

    get name(): ?string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    get host(): ?string {
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

    get geoData(): ?GeoData {
        return this._geoData;
    }

    set geoData(value: GeoData) {
        this._geoData = value;
    }

    get statistics() {
        return this._statistics;
    }

    set statistics(value:Statistics) {
        this._statistics = value;
    }

    get dateDiscovered(): ?Date {
        return this._dateDiscovered;
    }

    set dateDiscovered(value: Date) {
        this._dateDiscovered = value;
    }

    get dateUpdated(): ?Date {
        return this._dateUpdated;
    }

    set dateUpdated(value: Date) {
        this._dateUpdated = value;
    }

    toJSON():Object {
        return {
            ip: this.ip,
            port: this.port,
            publicKey: this.publicKey,
            name: this.name,
            ledgerVersion: this.ledgerVersion,
            overlayVersion: this.overlayVersion,
            overlayMinVersion: this.overlayMinVersion,
            networkId: this.networkId,
            versionStr: this.versionStr,
            active: this.active,
            quorumSet: this.quorumSet,
            geoData: this.geoData,
            statistics: this.statistics,
            dateDiscovered: this.dateDiscovered,
            dateUpdated: this.dateUpdated
        };
    };

    static fromJSON(node:string|Object):Node {
        let nodeObject;
        if((typeof node) === 'string') {
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
        newNode.quorumSet = QuorumSet.fromJSON(nodeObject.quorumSet);
        newNode.geoData = GeoData.fromJSON(nodeObject.geoData);
        newNode.statistics = Statistics.fromJSON(nodeObject.statistics);
        newNode.name = nodeObject.name;
        newNode.host = nodeObject.host;
        newNode.dateDiscovered = nodeObject.dateDiscovered;
        newNode.dateUpdated = nodeObject.dateUpdated;

        return newNode;
    }
}

module.exports = Node;
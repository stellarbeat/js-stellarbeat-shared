// 
const QuorumSet = require('./quorum-set');
const GeoData = require('./node-geo-data');
const Statistics = require('./node-statistics');

class Node {

    constructor(ip, port = 11625, publicKey = undefined, active = false, overLoaded = false, quorumSet = new QuorumSet(), geoData = new GeoData(), statistics = new Statistics(), dateDiscovered = new Date(), dateUpdated = new Date() ) {
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

    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
    }

    get overLoaded() {
        return this._overLoaded;
    }

    set overLoaded(value) {
        this._overLoaded = value;
    }

    get key() {
        return this._ip + ":" + this._port;
    }

    get ip() {
        return this._ip;
    }

    set ip(value) {
        this._ip = value;
    }

    get port() {
        return this._port;
    }

    set port(value) {
        this._port = value;
    }

    get publicKey() {
        return this._publicKey;
    }

    set publicKey(value) {
        this._publicKey = value;
    }

    get name() {
        return this._name;
    }

    set name(value) {
        this._name = value;
    }

    get host() {
        return this._host;
    }

    set host(value) {
        this._host = value;
    }

    get ledgerVersion() {
        return this._ledgerVersion;
    }

    set ledgerVersion(value) {
        this._ledgerVersion = value;
    }

    get overlayVersion() {
        return this._overlayVersion;
    }

    set overlayVersion(value) {
        this._overlayVersion = value;
    }

    get overlayMinVersion() {
        return this._overlayMinVersion;
    }

    set overlayMinVersion(value) {
        this._overlayMinVersion = value;
    }

    get networkId() {
        return this._networkId;
    }

    set networkId(value) {
        this._networkId = value;
    }

    get versionStr() {
        return this._versionStr;
    }

    set versionStr(value) {
        this._versionStr = value;
    }

    get quorumSet(){
        return this._quorumSet;
    }

    set quorumSet(value) {
        this._quorumSet = value;
    }

    get geoData() {
        return this._geoData;
    }

    set geoData(value) {
        this._geoData = value;
    }

    get statistics() {
        return this._statistics;
    }

    set statistics(value) {
        this._statistics = value;
    }

    get dateDiscovered() {
        return this._dateDiscovered;
    }

    set dateDiscovered(value) {
        this._dateDiscovered = value;
    }

    get dateUpdated() {
        return this._dateUpdated;
    }

    set dateUpdated(value) {
        this._dateUpdated = value;
    }

    toJSON() {
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
            dateUpdated: this.dateUpdated
        };
    };

    static fromJSON(node) {
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
        newNode.overLoaded = nodeObject.overLoaded;
        newNode.quorumSet = QuorumSet.fromJSON(nodeObject.quorumSet);
        newNode.geoData = GeoData.fromJSON(nodeObject.geoData);
        newNode.statistics = Statistics.fromJSON(nodeObject.statistics);
        newNode.name = nodeObject.name;
        newNode.host = nodeObject.host;
        newNode.dateDiscovered = new Date(nodeObject.dateDiscovered);
        newNode.dateUpdated = new Date(nodeObject.dateUpdated);

        return newNode;
    }
}

module.exports = Node;
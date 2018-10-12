// 
const QuorumSet = require('./quorum-set');
const GeoData = require('./node-geo-data');
const Statistics = require('./node-statistics');

class Node {

    constructor(ip, port, publicKey = undefined, quorumSet = new QuorumSet(), geoData = new GeoData(), statistics = new Statistics()) {
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

    get active() {
        return this._active;
    }

    set active(value) {
        this._active = value;
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

    toJSON() {
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
            statistics: this.statistics
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
        newNode.quorumSet = QuorumSet.fromJSON(nodeObject.quorumSet);
        newNode.geoData = GeoData.fromJSON(nodeObject.geoData);
        newNode.statistics = Statistics.fromJSON(nodeObject.statistics);
        newNode.name = nodeObject.name;
        newNode.host = nodeObject.host;

        return newNode;
    }
}

module.exports = Node;
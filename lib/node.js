// 
const QuorumSet = require('./quorum-set');

class Node {

    constructor(ip, port, publicKey = undefined, ledgerVersion = undefined,
                overlayVersion = undefined, overlayMinVersion = undefined,
                networkId = undefined, versionStr = undefined, active = false,
                quorumSet = new QuorumSet()
    ) {
        this._ip = ip;
        this._port = port;
        this._publicKey = publicKey;
        this._ledgerVersion = ledgerVersion;
        this._overlayVersion = overlayVersion;
        this._overlayMinVersion = overlayMinVersion;
        this._networkId = networkId;
        this._versionStr = versionStr;
        this._quorumSet = quorumSet;
        this._active = active;
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
            quorumSet: this.quorumSet
        };
    };

    static fromJSON(node) {
        let nodeObject;
        if((typeof node) === 'string') {
            nodeObject = JSON.parse(node);
        } else
            nodeObject = node;

        return new Node(
            nodeObject.ip, nodeObject.port, nodeObject.publicKey,
            nodeObject.ledgerVersion, nodeObject.overlayVersion,
            nodeObject.overlayMinVersion, nodeObject.networkId, nodeObject.versionStr,
            nodeObject.active,
            QuorumSet.fromJSON(nodeObject.quorumSet)
        );
    }
}

module.exports = Node;
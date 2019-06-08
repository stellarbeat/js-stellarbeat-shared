import {Network, TypeIndex, ActiveIndex, Node, VersionIndex, TrustIndex, AgeIndex} from "./../index";
import {ValidatingIndex} from "./index/validating-index";

export class NodeIndex {

    _network: Network;
    _versionIndex: VersionIndex;
    _trustIndex: TrustIndex;

    constructor(network: Network) {
        this._network = network;
        this._versionIndex = new VersionIndex(this._network);
        this._trustIndex = new TrustIndex(this._network);
    }

    getIndex(node: Node): number {//index two digits after comma

        return Number(
            (
                (
                    TypeIndex.get(node)
                    + ActiveIndex.get(node)
                    + ValidatingIndex.get(node)
                    + this._versionIndex.get(node)
                    + this._trustIndex.get(node)
                    + AgeIndex.get(node)
                ) / 6
            ).toFixed(2)
        );
    }
}
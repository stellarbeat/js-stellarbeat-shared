import {TypeIndex, ActiveIndex, Node, VersionIndex, TrustIndex, AgeIndex} from "./../index";
import {ValidatingIndex} from "./index/validating-index";

//todo: extract to separate package (version detection packages don't need to be included in frontend
export class NodeIndex {

    _nodes: Node[];
    _versionIndex: VersionIndex;
    _trustIndex: TrustIndex;

    constructor(nodes: Node[]) {
        this._nodes = nodes;
        this._versionIndex = new VersionIndex(this._nodes);
        this._trustIndex = new TrustIndex(this._nodes);
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
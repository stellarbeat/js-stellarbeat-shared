import {PublicKey} from "./network";

export default class FbasAnalysisResult {
    
    /*
    topTierFiltered: PublicKey[] = [];
    hasQuorumIntersection: boolean = false;
    hasQuorumIntersectionFiltered: boolean = false;
    minBlockingNodeSets?: PublicKey[][];
    minSplittingNodeSets?: PublicKey[][];
    minBlockingOrganizationSets?: PublicKey[][];
    minSplittingOrganizationSets?: PublicKey[][];
    */
    
    hasQuorumIntersection: boolean = false;
    hasQuorumIntersectionFiltered:boolean = false;
    minBlockingSetSize: number = 0;
    minBlockingSetFilteredSize:number = 0;
    minBlockingSetOrgsSize: number = 0;
    minBlockingSetOrgsFilteredSize: number = 0;
    minSplittingSetSize: number = 0;
    minSplittingSetFilteredSize: number = 0;
    minSplittingSetOrgsSize: number = 0;
    minSplittingSetOrgsFilteredSize: number = 0;
    topTierSize: number = 0;
    topTierFilteredSize: number = 0;
    topTierOrgsSize: number = 0;
    topTierOrgsFilteredSize: number = 0;

    static fromJSON(fbasResult:string|Object):FbasAnalysisResult {
        let fbasResultObject: any;
        if (typeof fbasResult === 'string') {
            fbasResultObject = JSON.parse(fbasResult);
        } else
            fbasResultObject = fbasResult;

        let newFbasResult = new FbasAnalysisResult();
        for (const [key, value] of Object.entries(FbasAnalysisResult)) {
            //@ts-ignore
            newFbasResult[key] = value;
        }

        return newFbasResult;
    }
}
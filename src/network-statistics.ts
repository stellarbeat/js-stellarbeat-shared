import {PublicKey} from "./network";

export default class NetworkStatistics {
    nrOfActiveWatchers: number = 0;
    nrOfActiveValidators: number = 0; //validators that are validating
    nrOfActiveFullValidators: number = 0;
    nrOfActiveOrganizations: number = 0;
    transitiveQuorumSetSize: number = 0;
    hasQuorumIntersection?: boolean;
    hasQuorumIntersectionFiltered?:boolean;
    minBlockingSetSize?: number;
    minBlockingSetFilteredSize:number = 0;
    minBlockingSetOrgsSize?: number;
    minBlockingSetOrgsFilteredSize?: number;
    minSplittingSetSize?: number;
    minSplittingSetFilteredSize?: number;
    minSplittingSetOrgsSize?: number;
    minSplittingSetOrgsFilteredSize?: number;
    topTierSize?: number;
    topTierFilteredSize?: number;
    topTierOrgsSize?: number;
    topTierOrgsFilteredSize?: number;

    static fromJSON(networkStats:string|Object):NetworkStatistics {
        let networkStatsObject: any;
        if (typeof networkStats === 'string') {
            networkStatsObject = JSON.parse(networkStats);
        } else
            networkStatsObject = networkStats;

        let newFbasResult = new NetworkStatistics();
        for (const [key, value] of Object.entries(networkStatsObject)) {
            //@ts-ignore
            newFbasResult[key] = value;
        }

        return newFbasResult;
    }
}
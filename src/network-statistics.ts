import {PublicKey} from "./network";

export default class NetworkStatistics {
    time: Date = new Date();
    nrOfActiveWatchers: number = 0;
    nrOfActiveValidators: number = 0; //validators that are validating
    nrOfActiveFullValidators: number = 0;
    nrOfActiveOrganizations: number = 0;
    transitiveQuorumSetSize: number = 0;
    hasTransitiveQuorumSet: boolean = false;
    hasQuorumIntersection?: boolean;
    minBlockingSetSize?: number;
    minBlockingSetFilteredSize:number = 0;
    minBlockingSetOrgsSize?: number;
    minBlockingSetOrgsFilteredSize?: number;
    minBlockingSetCountrySize?: number;
    minBlockingSetCountryFilteredSize?: number;
    minBlockingSetISPSize?: number;
    minBlockingSetISPFilteredSize?: number;
    minSplittingSetSize?: number;
    minSplittingSetOrgsSize?: number;
    minSplittingSetCountrySize?: number;
    minSplittingSetISPSize?: number;
    topTierSize?: number;
    topTierOrgsSize?: number;
    hasSymmetricTopTier: boolean = false;

    static fromJSON(networkStats:string|Object):NetworkStatistics {
        let networkStatsObject: any;
        if (typeof networkStats === 'string') {
            networkStatsObject = JSON.parse(networkStats);
        } else
            networkStatsObject = networkStats;

        let newNetworkStatistics = new NetworkStatistics();
        for (const [key, value] of Object.entries(networkStatsObject)) {
            if(key === 'time'){
                //@ts-ignore
                newNetworkStatistics.time = new Date(value);
            }
            else {
                //@ts-ignore
                newNetworkStatistics[key] = value;
            }
        }

        return newNetworkStatistics;
    }
}
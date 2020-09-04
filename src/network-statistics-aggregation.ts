import {PublicKey} from "./network";

export default class NetworkStatisticsAggregation {

    time: Date = new Date();
    nrOfActiveWatchersSum: number = 0;
    nrOfActiveValidatorsSum: number = 0;
    nrOfActiveFullValidatorsSum: number = 0;
    nrOfActiveOrganizationsSum: number = 0;
    transitiveQuorumSetSizeSum: number = 0;
    hasQuorumIntersectionCount: number = 0;
    hasQuorumIntersectionFilteredCount: number = 0;
    topTierMin: number = 0;
    topTierMax: number = 0;
    topTierSum: number = 0;
    topTierFilteredMin: number = 0;
    topTierFilteredMax: number = 0;
    topTierFilteredSum: number = 0;
    topTierOrgsMin: number = 0;
    topTierOrgsMax: number = 0;
    topTierOrgsSum: number = 0;
    topTierOrgsFilteredMin: number = 0;
    topTierOrgsFilteredMax: number = 0;
    topTierOrgsFilteredSum: number = 0;
    minBlockingSetMin: number = 0;
    minBlockingSetMax: number = 0;
    minBlockingSetSum: number = 0;
    minBlockingSetOrgsMin: number = 0;
    minBlockingSetOrgsMax: number = 0;
    minBlockingSetOrgsSum: number = 0;
    minBlockingSetFilteredMin: number = 0;
    minBlockingSetFilteredMax: number = 0;
    minBlockingSetFilteredSum: number = 0;
    minBlockingSetOrgsFilteredMin: number = 0;
    minBlockingSetOrgsFilteredMax: number = 0;
    minBlockingSetOrgsFilteredSum: number = 0;
    minSplittingSetMin: number = 0;
    minSplittingSetMax: number = 0;
    minSplittingSetSum: number = 0;
    minSplittingSetOrgsMin: number = 0;
    minSplittingSetOrgsMax: number = 0;
    minSplittingSetOrgsSum: number = 0;
    minSplittingSetFilteredMin: number = 0;
    minSplittingSetFilteredMax: number = 0;
    minSplittingSetFilteredSum: number = 0;
    minSplittingSetOrgsFilteredMin: number = 0;
    minSplittingSetOrgsFilteredMax: number = 0;
    minSplittingSetOrgsFilteredSum: number = 0;
    crawlCount:number = 0;

    get nrOfActiveWatchersAverage() {
        return +((this.nrOfActiveWatchersSum / this.crawlCount).toFixed(2));
    }

    get nrOfActiveValidatorsAverage() {
        return +((this.nrOfActiveValidatorsSum / this.crawlCount).toFixed(2));
    }

    get nrOfActiveFullValidatorsAverage() {
        return +((this.nrOfActiveFullValidatorsSum / this.crawlCount).toFixed(2));
    }

    get nrOfActiveOrganizationsAverage() {
        return +((this.nrOfActiveOrganizationsSum / this.crawlCount).toFixed(2));
    }

    get transitiveQuorumSetSizeAverage() {
        return +((this.transitiveQuorumSetSizeSum / this.crawlCount).toFixed(2));
    }

    get hasQuorumIntersectionCountAverage() {
        return +((this.hasQuorumIntersectionCount / this.crawlCount).toFixed(2));
    }

    get hasQuorumIntersectionFilteredCountAverage() {
        return +((this.hasQuorumIntersectionFilteredCount / this.crawlCount).toFixed(2));
    }

    get topTierAverage() {
        return  +((this.topTierSum / this.crawlCount)).toFixed(2);
    }

    get topTierFilteredAverage() {
        return  +((this.topTierFilteredSum / this.crawlCount)).toFixed(2);
    }

    get topTierOrgsAverage() {
        return  +((this.topTierOrgsSum / this.crawlCount)).toFixed(2);
    }

    get topTierOrgsFilteredAverage() {
        return  +((this.topTierOrgsFilteredSum / this.crawlCount)).toFixed(2);
    }

    get minBlockingSetAverage() {
        return  +((this.minBlockingSetSum / this.crawlCount)).toFixed(2);
    }

    get minBlockingSetFilteredAverage() {
        return  +((this.minBlockingSetFilteredSum / this.crawlCount)).toFixed(2);
    }

    get minBlockingSetOrgsAverage() {
        return  +((this.minBlockingSetSum / this.crawlCount)).toFixed(2);
    }

    get minBlockingSetOrgsFilteredAverage() {
        return  +((this.minBlockingSetOrgsFilteredSum / this.crawlCount)).toFixed(2);
    }

    get minSplittingSetAverage() {
        return  +((this.minSplittingSetSum / this.crawlCount)).toFixed(2);
    }

    get minSplittingSetFilteredAverage() {
        return  +((this.minSplittingSetFilteredSum / this.crawlCount)).toFixed(2);
    }

    get minSplittingSetOrgsAverage() {
        return  +((this.minSplittingSetSum / this.crawlCount)).toFixed(2);
    }

    get minSplittingSetOrgsFilteredAverage() {
        return  +((this.minSplittingSetOrgsFilteredSum / this.crawlCount)).toFixed(2);
    }
    

    static fromJSON(networkStats:string|Object):NetworkStatisticsAggregation {
        let networkStatsObject: any;
        if (typeof networkStats === 'string') {
            networkStatsObject = JSON.parse(networkStats);
        } else
            networkStatsObject = networkStats;

        let newNetworkStatsAggregation = new NetworkStatisticsAggregation();
        for (const [key, value] of Object.entries(networkStatsObject)) {
            //@ts-ignore
            newNetworkStatsAggregation[key] = value;
        }

        return newNetworkStatsAggregation;
    }
}
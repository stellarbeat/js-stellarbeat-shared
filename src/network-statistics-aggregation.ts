import {PublicKey} from "./network";

export default class NetworkStatisticsAggregation {

    time: Date = new Date();
    nrOfActiveWatchersSum: number = 0;
    nrOfActiveValidatorsSum: number = 0;
    nrOfActiveFullValidatorsSum: number = 0;
    nrOfActiveOrganizationsSum: number = 0;
    transitiveQuorumSetSizeSum: number = 0;
    hasQuorumIntersectionCount: number = 0;
    hasTransitiveQuorumSetCount: number = 0;
    topTierMin: number = 0;
    topTierMax: number = 0;
    topTierSum: number = 0;
    topTierOrgsMin: number = 0;
    topTierOrgsMax: number = 0;
    topTierOrgsSum: number = 0;
    minBlockingSetMin: number = 0;
    minBlockingSetMax: number = 0;
    minBlockingSetSum: number = 0;
    minBlockingSetOrgsMin: number = 0;
    minBlockingSetOrgsMax: number = 0;
    minBlockingSetOrgsSum: number = 0;
    minBlockingCountryOrgsMin: number = 0;
    minBlockingSetCountryMax: number = 0;
    minBlockingSetCountrySum: number = 0;
    minBlockingSetISPMin: number = 0;
    minBlockingSetISPMax: number = 0;
    minBlockingSetISPSum: number = 0;
    minBlockingSetFilteredMin: number = 0;
    minBlockingSetFilteredMax: number = 0;
    minBlockingSetFilteredSum: number = 0;
    minBlockingSetOrgsFilteredMin: number = 0;
    minBlockingSetOrgsFilteredMax: number = 0;
    minBlockingSetOrgsFilteredSum: number = 0;
    minBlockingSetCountryFilteredMin: number = 0;
    minBlockingSetCountryFilteredMax: number = 0;
    minBlockingSetCountryFilteredSum: number = 0;
    minBlockingSetISPFilteredMin: number = 0;
    minBlockingSetISPFilteredMax: number = 0;
    minBlockingSetISPFilteredSum: number = 0;
    minSplittingSetMin: number = 0;
    minSplittingSetMax: number = 0;
    minSplittingSetSum: number = 0;
    minSplittingSetOrgsMin: number = 0;
    minSplittingSetOrgsMax: number = 0;
    minSplittingSetOrgsSum: number = 0;
    crawlCount: number = 0;

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

    get hasTransitiveQuorumSetAverage() {
        return +((this.hasTransitiveQuorumSetCount / this.crawlCount).toFixed(2));
    }

    get hasQuorumIntersectionAverage() {
        return +((this.hasQuorumIntersectionCount / this.crawlCount).toFixed(2));
    }

    get topTierAverage() {
        return this.getAverage(this.topTierSum);
    }

    get topTierOrgsAverage() {
        return this.getAverage(this.topTierOrgsSum);
    }

    get minBlockingSetAverage() {
        return this.getAverage(this.minBlockingSetSum);
    }

    get minBlockingSetFilteredAverage() {
        return this.getAverage(this.minBlockingSetFilteredSum);
    }

    get minBlockingSetOrgsAverage() {
        return this.getAverage(this.minBlockingSetOrgsSum);
    }

    get minBlockingSetOrgsFilteredAverage() {
        return this.getAverage(this.minBlockingSetOrgsFilteredSum);
    }

    get minBlockingSetCountryAverage() {
        return this.getAverage(this.minBlockingSetCountrySum);
    }

    get minBlockingSetCountryFilteredAverage() {
        return this.getAverage(this.minBlockingSetCountryFilteredSum);
    }

    get minBlockingSetISPAverage() {
        return this.getAverage(this.minBlockingSetISPSum);
    }

    get minBlockingSetISPFilteredAverage() {
        return this.getAverage(this.minBlockingSetISPFilteredSum);
    }

    get minSplittingSetAverage() {
        return this.getAverage(this.minSplittingSetSum);
    }

    get minSplittingSetOrgsAverage() {
        return this.getAverage(this.minSplittingSetOrgsSum);
    }

    protected getAverage(value: number) {
        if (this.crawlCount === 0)
            return 0;

        return +((value / this.crawlCount)).toFixed(2);
    }

    static fromJSON(networkStats: string | Object): NetworkStatisticsAggregation {
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
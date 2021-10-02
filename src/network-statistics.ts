export default class NetworkStatistics {
	time: Date = new Date();
	nrOfActiveWatchers = 0;
	nrOfActiveValidators = 0; //validators that are validating
	nrOfActiveFullValidators = 0;
	nrOfActiveOrganizations = 0;
	transitiveQuorumSetSize = 0;
	hasTransitiveQuorumSet = false;
	hasQuorumIntersection?: boolean;
	minBlockingSetSize?: number;
	minBlockingSetFilteredSize = 0;
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
	hasSymmetricTopTier = false;

	static fromJSON(
		networkStats: string | Record<string, unknown>
	): NetworkStatistics {
		let networkStatsObject: Record<string, unknown>;
		if (typeof networkStats === 'string') {
			networkStatsObject = JSON.parse(networkStats);
		} else networkStatsObject = networkStats;

		const newNetworkStatistics = new NetworkStatistics();
		for (const [key, value] of Object.entries(networkStatsObject)) {
			if (key === 'time') {
				//@ts-ignore
				newNetworkStatistics.time = new Date(value);
			} else {
				//@ts-ignore
				newNetworkStatistics[key] = value;
			}
		}

		return newNetworkStatistics;
	}
}

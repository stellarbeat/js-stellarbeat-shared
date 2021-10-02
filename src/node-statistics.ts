export class NodeStatistics {
	public active30DaysPercentage = 0;
	public overLoaded30DaysPercentage = 0;
	public validating30DaysPercentage = 0;
	public active24HoursPercentage = 0;
	public overLoaded24HoursPercentage = 0;
	public validating24HoursPercentage = 0;
	public has30DayStats = false;
	public has24HourStats = false;

	toJSON(): Record<string, unknown> {
		return {
			active30DaysPercentage: this.active30DaysPercentage,
			overLoaded30DaysPercentage: this.overLoaded30DaysPercentage,
			validating30DaysPercentage: this.validating30DaysPercentage,
			active24HoursPercentage: this.active24HoursPercentage,
			overLoaded24HoursPercentage: this.overLoaded24HoursPercentage,
			validating24HoursPercentage: this.validating24HoursPercentage,
			has24HourStats: this.has24HourStats,
			has30DayStats: this.has30DayStats
		};
	}

	static fromJSON(
		nodeStatistics: string | Record<string, unknown>
	): NodeStatistics {
		if (nodeStatistics === undefined) {
			return new NodeStatistics();
		}

		let nodeStatisticsObject;
		if (typeof nodeStatistics === 'string') {
			nodeStatisticsObject = JSON.parse(nodeStatistics);
		} else nodeStatisticsObject = nodeStatistics;

		const newNodeStatistics = new NodeStatistics();

		if (nodeStatisticsObject.active30DaysPercentage)
			newNodeStatistics.active30DaysPercentage =
				nodeStatisticsObject.active30DaysPercentage;
		if (nodeStatisticsObject.overLoaded30DaysPercentage)
			newNodeStatistics.overLoaded30DaysPercentage =
				nodeStatisticsObject.overLoaded30DaysPercentage;
		if (nodeStatisticsObject.validating30DaysPercentage)
			newNodeStatistics.validating30DaysPercentage =
				nodeStatisticsObject.validating30DaysPercentage;
		if (nodeStatisticsObject.active24HoursPercentage)
			newNodeStatistics.active24HoursPercentage =
				nodeStatisticsObject.active24HoursPercentage;
		if (nodeStatisticsObject.overLoaded24HoursPercentage)
			newNodeStatistics.overLoaded24HoursPercentage =
				nodeStatisticsObject.overLoaded24HoursPercentage;
		if (nodeStatisticsObject.validating24HoursPercentage)
			newNodeStatistics.validating24HoursPercentage =
				nodeStatisticsObject.validating24HoursPercentage;
		if (nodeStatisticsObject.has30DayStats !== undefined)
			newNodeStatistics.has30DayStats = nodeStatisticsObject.has30DayStats;
		if (nodeStatisticsObject.has24HourStats !== undefined)
			newNodeStatistics.has24HourStats = nodeStatisticsObject.has24HourStats;

		return newNodeStatistics;
	}
}

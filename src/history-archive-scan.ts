import {isNumber, isString} from "./typeguards";

export class HistoryArchiveScan {
	constructor(
		public readonly url: string,
		public readonly startDate: Date,
		public readonly endDate: Date,
		public readonly latestVerifiedLedger: number,
		public readonly hasGap: boolean,
		public readonly gapUrl: string|null,
		public readonly gapCheckPoint: number|null
	) {}
	static fromJSON(scanJSON: string | Record<string, unknown>): HistoryArchiveScan {
		let scanDTO: Record<string, unknown>;
		if (typeof scanJSON === 'string') {
			scanDTO = JSON.parse(scanJSON);
		} else scanDTO = scanJSON;

		const url = scanDTO.url;
		if (!isString(url)) {
			throw new Error('missing url');
		}

		const startDateString = scanDTO.startDate;
		if(!isString(startDateString))
			throw new Error('startDate missing');

		const endDateString = scanDTO.endDate;
		if(!isString(endDateString))
			throw new Error('endDate missing');

		const latestVerifiedLedger= scanDTO.latestVerifiedLedger;
		if(!isNumber(latestVerifiedLedger))
			throw new Error('latest verified ledger missing');

		const hasGap = scanDTO.hasGap === true;

		const gapUrl = isString(scanDTO.gapUrl) ? scanDTO.gapUrl : null

		const gapCheckPoint = isNumber(scanDTO.gapCheckPoint) ? scanDTO.gapCheckPoint : null;

		return new HistoryArchiveScan(url, new Date(startDateString), new Date(endDateString), latestVerifiedLedger, hasGap, gapUrl, gapCheckPoint);
	}
}

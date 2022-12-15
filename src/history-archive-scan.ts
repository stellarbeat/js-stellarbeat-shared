import {isNumber, isString} from "./typeguards";

export class HistoryArchiveScan {
	constructor(
		public readonly url: string,
		public readonly startDate: Date,
		public readonly endDate: Date,
		public readonly latestVerifiedLedger: number,
		public readonly hasError: boolean,
		public readonly errorUrl: string|null,
		public readonly errorMessage: string|null,
		public readonly isSlow: boolean
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

		const hasError = scanDTO.hasError === true;
		const errorUrl = isString(scanDTO.errorUrl) ? scanDTO.errorUrl: null
		const errorMessage = isString(scanDTO.errorMessage) ? scanDTO.errorMessage: null

		const isSlow = scanDTO.isSlow === true;

		return new HistoryArchiveScan(url, new Date(startDateString), new Date(endDateString), latestVerifiedLedger, hasError, errorUrl, errorMessage, isSlow);
	}
}

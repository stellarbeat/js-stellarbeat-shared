import { Organization } from './organization';
import { isObject } from './typeguards';

export class OrganizationSnapShot {
	public startDate: Date;
	public endDate: Date;
	public organization: Organization;

	constructor(startDate: Date, endDate: Date, organization: Organization) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.organization = organization;
	}

	toJSON(): Record<string, unknown> {
		return {
			startDate: this.startDate,
			endDate: this.endDate,
			organization: this.organization
		};
	}

	static fromJSON(
		organizationSnapShot: string | Record<string, unknown>
	): OrganizationSnapShot {
		let snapShotObject: Record<string, unknown>;
		if (typeof organizationSnapShot === 'string') {
			snapShotObject = JSON.parse(organizationSnapShot);
		} else snapShotObject = organizationSnapShot;

		if (
			typeof snapShotObject.startDate === 'string' &&
			typeof snapShotObject.endDate === 'string' &&
			isObject(snapShotObject.organization)
		) {
			return new OrganizationSnapShot(
				new Date(snapShotObject.startDate),
				new Date(snapShotObject.endDate),
				Organization.fromJSON(snapShotObject.organization)
			);
		} else throw new Error('EndDate, startDate or organization missing');
	}
}

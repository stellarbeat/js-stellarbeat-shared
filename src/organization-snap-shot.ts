import { Organization } from './organization';

export class OrganizationSnapShot {
	public startDate: Date;
	public endDate: Date;
	public organization: Organization;

	constructor(startDate: Date, endDate: Date, organization: Organization) {
		this.startDate = startDate;
		this.endDate = endDate;
		this.organization = organization;
	}

	toJSON(): Object {
		return {
			startDate: this.startDate,
			endDate: this.endDate,
			organization: this.organization
		};
	}

	static fromJSON(organizationSnapShot: string | Object): OrganizationSnapShot {
		let snapShotObject: any;
		if (typeof organizationSnapShot === 'string') {
			snapShotObject = JSON.parse(organizationSnapShot);
		} else snapShotObject = organizationSnapShot;

		return new OrganizationSnapShot(
			new Date(snapShotObject.startDate),
			new Date(snapShotObject.endDate),
			Organization.fromJSON(snapShotObject.organization)!
		);
	}
}

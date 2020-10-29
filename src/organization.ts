import {OrganizationId} from "./network";

type PublicKey = string;

export class Organization {
    public readonly id:OrganizationId;
    public readonly name:string;
    public dba?: string;
    public url?: string;
    public logo?: string;
    public description?: string;
    public physicalAddress?: string;
    public physicalAddressAttestation?: string;
    public phoneNumber?: string;
    public phoneNumberAttestation?:string;
    public keybase?: string;
    public twitter?: string;
    public github?: string;
    public officialEmail?: string;
    public validators: PublicKey[] = [];
    public subQuorumAvailable: boolean = false;
    public has30DayStats:boolean = false;
    public has24HourStats: boolean = false;
    public subQuorum24HoursAvailability: number = 0;
    public subQuorum30DaysAvailability: number = 0;

    public dateDiscovered?: Date;

    constructor(id:string, name:string) {
        this.id = id;
        this.name = name;
    }

    get subQuorumFailAt(): number {
        return this.validators.length - this.subQuorumThreshold + 1;
    }

    get subQuorumThreshold(): number {
        return Math.floor(this.validators.length - (this.validators.length - 1) / 2); //simple majority
    }

    get isTierOneOrganization(){
        if(!this.has30DayStats)
            return false;
        return this.subQuorum30DaysAvailability >= 99 && this.validators.length >=3;
    }

    public toJSON() :Object {
        return {
            id: this.id,
            name: this.name,
            dba: this.dba,
            url: this.url,
            logo: this.logo,
            description: this.description,
            physicalAddress: this.physicalAddress,
            physicalAddressAttestation: this.physicalAddressAttestation,
            phoneNumber: this.phoneNumber,
            phoneNumberAttestation: this.phoneNumberAttestation,
            keybase: this.keybase,
            twitter: this.twitter,
            github: this.github,
            officialEmail: this.officialEmail,
            validators: this.validators,
            subQuorumAvailable: this.subQuorumAvailable,
            subQuorum24HoursAvailability: this.subQuorum24HoursAvailability,
            subQuorum30DaysAvailability: this.subQuorum30DaysAvailability,
            has30DayStats: this.has30DayStats,
            has24HourStats: this.has24HourStats,
            dateDiscovered: this.dateDiscovered,
            isTierOneOrganization: this.isTierOneOrganization
        }
    }


    static fromJSON(organization:string|Object):Organization|undefined {
        if(organization === undefined) {
            return undefined;
        }

        let organizationObject:any;

        if(typeof organization === 'string') {
            organizationObject = JSON.parse(organization);
        } else
            organizationObject = organization;

        let newOrganization = new Organization(organizationObject.id, organizationObject.name);
        newOrganization.dba=organizationObject.dba;
        newOrganization.url=organizationObject.url;
        newOrganization.logo=organizationObject.logo;
        newOrganization.description=organizationObject.description;
        newOrganization.physicalAddress=organizationObject.physicalAddress;
        newOrganization.physicalAddressAttestation=organizationObject.physicalAddressAttestation;
        newOrganization.phoneNumber=organizationObject.phoneNumber;
        newOrganization.phoneNumberAttestation=organizationObject.phoneNumberAttestation;
        newOrganization.keybase=organizationObject.keybase;
        newOrganization.twitter=organizationObject.twitter;
        newOrganization.github=organizationObject.github;
        newOrganization.officialEmail=organizationObject.officialEmail;
        if(organizationObject.validators !== undefined)
            newOrganization.validators=organizationObject.validators;
        newOrganization.subQuorum24HoursAvailability=organizationObject.subQuorum24HoursAvailability;
        newOrganization.subQuorum30DaysAvailability=organizationObject.subQuorum30DaysAvailability;
        newOrganization.dateDiscovered = organizationObject.dateDiscovered;
        newOrganization.subQuorumAvailable = organizationObject.subQuorumAvailable;
        newOrganization.has30DayStats = organizationObject.has30DayStats;
        newOrganization.has24HourStats = organizationObject.has24HourStats;

        return newOrganization;
    }

    toString(){
        return `Organization (id: ${this.id}, name: ${this.name})`;
    }
}
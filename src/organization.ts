import {OrganizationId, PublicKey} from "./network";
import PropertyMapper from "./PropertyMapper";

export function isOrganization(organization: Organization | undefined): organization is Organization {
    return organization instanceof Organization;
}

export class Organization {
    public readonly id:OrganizationId;
    public name:string;
    public dba: string|null = null;
    public url: string|null = null;
    public horizonUrl: string|null = null;
    public logo: string|null = null;
    public description: string|null = null;
    public physicalAddress: string|null = null;
    public phoneNumber: string|null = null;
    public keybase: string|null = null;
    public twitter: string|null = null;
    public github: string|null = null;
    public officialEmail: string|null = null;
    public validators: PublicKey[] = [];
    public subQuorumAvailable: boolean = false;
    public has30DayStats:boolean = false;
    public has24HourStats: boolean = false;
    public subQuorum24HoursAvailability: number = 0;
    public subQuorum30DaysAvailability: number = 0;
    public unknown:boolean = false;
    public homeDomain: string|null = null;//todo: not nullable

    public dateDiscovered?: Date;

    constructor(id:string, name: string) {
        this.id = id;
        this.name = name;
    }

    get subQuorumBlockedAt(): number {
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
            horizonUrl: this.horizonUrl,
            logo: this.logo,
            description: this.description,
            physicalAddress: this.physicalAddress,
            phoneNumber: this.phoneNumber,
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
            isTierOneOrganization: this.isTierOneOrganization,
            homeDomain: this.homeDomain
        }
    }

    static fromJSON(organizationJSON:string|Object):Organization {
        let organizationDTO:any;
        if(typeof organizationJSON === 'string') {
            organizationDTO = JSON.parse(organizationJSON);
        } else
            organizationDTO = organizationJSON;

        if (!organizationDTO.id) {
            throw new Error("organizationDTO missing id");
        }

        let organization = new Organization(organizationDTO.id, organizationDTO.name);
        PropertyMapper.mapProperties(organizationDTO, organization, ['id', 'name', 'dateDiscovered', 'dateUpdated', 'isTierOneOrganization']);

        if(organizationDTO.dateDiscovered !== undefined)
            organization.dateDiscovered = new Date(organizationDTO.dateDiscovered);

        return organization;
    }

    toString(){
        return `Organization (id: ${this.id}, name: ${this.name})`;
    }
}
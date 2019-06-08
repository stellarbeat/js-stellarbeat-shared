import {Organization} from '../src'

describe('json', () => {
    let organization = new Organization("1","Organization Name");
    organization.dba="Organization DBA";
    organization.url="https://www.domain.com";
    organization.logo="https://www.domain.com/awesomelogo.jpg";
    organization.description="Description of issuer";
    organization.physicalAddress="123 Sesame Street, New York, NY 12345, United States";
    organization.physicalAddressAttestation="https://www.domain.com/address_attestation.jpg";
    organization.phoneNumber="1 (123)-456-7890";
    organization.phoneNumberAttestation="https://www.domain.com/phone_attestation.jpg";
    organization.keybase="accountname";
    organization.twitter="orgtweet";
    organization.github="orgcode";
    organization.officialEmail="support@domain.com";
    organization.validators.push('GA');

    let organizationObject:any = {};
    organizationObject.name="Organization Name";
    organizationObject.dba="Organization DBA";
    organizationObject.url="https://www.domain.com";
    organizationObject.logo="https://www.domain.com/awesomelogo.jpg";
    organizationObject.description="Description of issuer";
    organizationObject.physicalAddress="123 Sesame Street, New York, NY 12345, United States";
    organizationObject.physicalAddressAttestation="https://www.domain.com/address_attestation.jpg";
    organizationObject.phoneNumber="1 (123)-456-7890";
    organizationObject.phoneNumberAttestation="https://www.domain.com/phone_attestation.jpg";
    organizationObject.keybase="accountname";
    organizationObject.twitter="orgtweet";
    organizationObject.github="orgcode";
    organizationObject.officialEmail="support@domain.com";
    organizationObject.validators = ['GA'];
    organizationObject.id = "1";

    test('OrgToJson', () => {
        expect(JSON.parse(JSON.stringify(organization))).toEqual(organizationObject);
    });
    test('JsonToOrg', () => {
        expect(Organization.fromJSON((JSON.stringify(organization)))).toEqual(organization);
    });
});
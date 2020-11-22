import {Node} from "./node";
import {Organization} from "./organization";
import NetworkStatistics from "./network-statistics";
import {Network, OrganizationId, PublicKey} from "./network";
import {QuorumSet} from "./quorum-set";
import {NodeGeoData} from "./node-geo-data";
import {NodeStatistics} from "./node-statistics";

export default class NetworkHydrator {
    static networkFromJson(network: string | Object): Network {
        //todo add json schema or something to validate. Could be reused in import/export
        let networkDTO: any;
        if (typeof network === 'string') {
            networkDTO = JSON.parse(network);
        } else
            networkDTO = network;

        let nodesAndOrganizations = NetworkHydrator.nodesAndOrganizationsFromJSON(networkDTO.nodes, networkDTO.organizations);

        let networkStatistics = NetworkStatistics.fromJSON(networkDTO.statistics);

        return new Network(nodesAndOrganizations.nodes, nodesAndOrganizations.organizations, new Date(networkDTO.time), networkStatistics);
    }

    static nodesAndOrganizationsFromJSON(nodesDTO: any, organizationsDTO: any){
        //hydrate the organizations without validators
        let organizationsMap: Map<OrganizationId, Organization> = new Map();
        organizationsDTO
            .forEach((organizationDTO: any) => {
                let organization = NetworkHydrator.organizationBasefromDTO(organizationDTO);
                organizationsMap.set(organization.id, organization);
            });

        //hydrate the basic node properties
        let nodesMap: Map<PublicKey, Node> = new Map();
        nodesDTO
            .forEach((nodeDTO: any) => {
                let node = NetworkHydrator.nodeBaseFromDTO(nodeDTO);
                if(nodeDTO.organizationId){
                    node.organization = organizationsMap.get(nodeDTO.organizationId);
                }
                node.geoData = NodeGeoData.fromJSON(nodeDTO.geoData);
                node.statistics = NodeStatistics.fromJSON(nodeDTO.statistics);
                nodesMap.set(node.publicKey, node);
            });

        //hydrate the quorumSets
        nodesDTO
            .forEach((nodeDTO: any) => {
                let node = nodesMap.get(nodeDTO.publicKey);
                if(!node)
                    return;

                NetworkHydrator.hydrateQuorumSet(node.quorumSet, nodeDTO.quorumSet, nodesMap);
            });

        //hydrate the organization validators
        organizationsDTO
            .forEach((organizationDTO: any) => {
                let organization = organizationsMap.get(organizationDTO.id)!;
                if(!organizationDTO.validators)
                    return;
                organizationDTO.validators.forEach((publicKey:string) => {
                    let validator = nodesMap.get(publicKey);
                    if (!validator) {
                        validator = new Node(publicKey);
                        validator.organization = organization;
                        nodesMap.set(publicKey, validator);
                    }
                    organization.validators.push(validator);
                })
            });

        return {
            nodes: Array.from(nodesMap.values()),
            organizations: Array.from(organizationsMap.values())
        }
    }

    protected static hydrateQuorumSet(quorumSet: QuorumSet, quorumSetDTO: any, publicKeyToNodeMap: Map<PublicKey, Node>) {
        quorumSet.threshold = quorumSetDTO.threshold;
        quorumSet.hashKey = quorumSetDTO.hashKey;
        quorumSetDTO.validators.forEach((publicKey: string) => {
            let validator = publicKeyToNodeMap.get(publicKey);
            if (!validator) {
                validator = new Node(publicKey);
                validator.isValidator = true;
                publicKeyToNodeMap.set(publicKey, validator);
            } else {
                validator.isValidator = true;
                //it could be a node is trusted by other nodes, or defined in a toml file of the org as a validator, but we have not yet picked up any quorumsets
                //todo: doesn't belong here, but have to figure out the right place
            }
            quorumSet.validators.push(validator);
        });
        quorumSetDTO.innerQuorumSets.forEach((innerQuorumSetDTO: any) => {
            let innerQuorumSet = new QuorumSet();
            NetworkHydrator.hydrateQuorumSet(innerQuorumSet, innerQuorumSetDTO, publicKeyToNodeMap);
        });
    }

    static nodeBaseFromDTO(nodeDTO: any): Node {
        if (!nodeDTO.publicKey) {
            throw new Error("nodeDTO missing public key");
        }

        let node = new Node(nodeDTO.publicKey,nodeDTO.ip, nodeDTO.port);
        node.ledgerVersion = nodeDTO.ledgerVersion;
        node.overlayVersion = nodeDTO.overlayVersion;
        node.overlayMinVersion = nodeDTO.overlayMinVersion;
        node.networkId = nodeDTO.networkId;
        node.versionStr = nodeDTO.versionStr;
        if(nodeDTO.isValidator !== undefined)
            node.isValidator = nodeDTO.isValidator;
        if(nodeDTO.active !== undefined)
            node.active = nodeDTO.active;
        if(nodeDTO.overLoaded !== undefined)
            node.overLoaded = nodeDTO.overLoaded;
        node.name = nodeDTO.name;
        node.host = nodeDTO.host;
        node.dateDiscovered = new Date(nodeDTO.dateDiscovered);
        node.dateUpdated = new Date(nodeDTO.dateUpdated);
        if(node.isFullValidator !== undefined)
            node.isFullValidator = nodeDTO.isFullValidator;
        node.index = nodeDTO.index;
        node.homeDomain = nodeDTO.homeDomain;
        if(nodeDTO.isValidating !== undefined)
            node.isValidating = nodeDTO.isValidating;
        node.historyUrl = nodeDTO.historyUrl;
        node.alias = nodeDTO.alias;
        node.isp = nodeDTO.isp;

        return node;
    }

    static organizationBasefromDTO(organizationDTO: any): Organization {
        let organization = new Organization(organizationDTO.id, organizationDTO.name);
        organization.dba = organizationDTO.dba;
        organization.url = organizationDTO.url;
        organization.logo = organizationDTO.logo;
        organization.description = organizationDTO.description;
        organization.physicalAddress = organizationDTO.physicalAddress;
        organization.physicalAddressAttestation = organizationDTO.physicalAddressAttestation;
        organization.phoneNumber = organizationDTO.phoneNumber;
        organization.phoneNumberAttestation = organizationDTO.phoneNumberAttestation;
        organization.keybase = organizationDTO.keybase;
        organization.twitter = organizationDTO.twitter;
        organization.github = organizationDTO.github;
        organization.officialEmail = organizationDTO.officialEmail;
        if(organizationDTO.subQuorum24HoursAvailability !== undefined)
            organization.subQuorum24HoursAvailability = organizationDTO.subQuorum24HoursAvailability;
        if(organizationDTO.subQuorum30DaysAvailability !== undefined)
            organization.subQuorum30DaysAvailability = organizationDTO.subQuorum30DaysAvailability;
        organization.dateDiscovered = organizationDTO.dateDiscovered;
        if(organizationDTO.subQuorumAvailable !== undefined)
            organization.subQuorumAvailable = organizationDTO.subQuorumAvailable;
        if(organizationDTO.has30DayStats !== undefined)
            organization.has30DayStats = organizationDTO.has30DayStats;
        if(organizationDTO.has24HourStats !== undefined)
            organization.has24HourStats = organizationDTO.has24HourStats;

        return organization;
    }
}
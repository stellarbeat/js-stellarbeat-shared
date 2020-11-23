import {Node} from "./node";
import {Organization} from "./organization";
import NetworkStatistics from "./network-statistics";
import {Network, OrganizationId, PublicKey} from "./network";
import {QuorumSet} from "./quorum-set";
import {NodeGeoData} from "./node-geo-data";
import {NodeStatistics} from "./node-statistics";

export default class NetworkHydrator {
    static hydrateNetwork(networkDTO: any): Network {

        let nodesAndOrganizations = NetworkHydrator.hydrateNodesAndOrganizations(networkDTO.nodes, networkDTO.organizations);

        let networkStatistics = NetworkStatistics.fromJSON(networkDTO.statistics);

        return new Network(nodesAndOrganizations.nodes, nodesAndOrganizations.organizations, new Date(networkDTO.time), networkStatistics);
    }

    static hydrateNodesAndOrganizations(nodesDTO: any, organizationsDTO: any){
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
                        validator.unknown = true;
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
        if(quorumSetDTO === undefined)
            return;

        quorumSet.threshold = quorumSetDTO.threshold;
        quorumSet.hashKey = quorumSetDTO.hashKey;
        quorumSetDTO.validators.forEach((publicKey: string) => {

            let validator = publicKeyToNodeMap.get(publicKey);
            if (!validator) {
                validator = new Node(publicKey);
                validator.unknown = true;
                publicKeyToNodeMap.set(publicKey, validator);
            }

            validator.isValidator = true; //because it is included in a quorumset, we classify it as a validator

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

        let node = new Node(nodeDTO.publicKey);

        NetworkHydrator.mapBasicProperties(nodeDTO, node, ['publicKey', 'geoData', 'quorumSet', 'organizationId', 'statistics', 'dateDiscovered', 'dateUpdated']);
        if(nodeDTO.dateDiscovered !== undefined)
            node.dateDiscovered = new Date(nodeDTO.dateDiscovered);
        if(nodeDTO.dateUpdated !== undefined)
            node.dateUpdated = new Date(nodeDTO.dateUpdated);

        return node;
    }

    static organizationBasefromDTO(organizationDTO: any): Organization {
        let organization = new Organization(organizationDTO.id, organizationDTO.name);
        NetworkHydrator.mapBasicProperties(organizationDTO, organization, ['id', 'name', 'validators', 'dateDiscovered', 'dateUpdated']);

        if(organizationDTO.dateDiscovered !== undefined)
            organization.dateDiscovered = new Date(organizationDTO.dateDiscovered);

        return organization;
    }

    static mapBasicProperties(dto: any, domainObject:any, propertiesToSkip: Array<string>){
        for (const [key, value] of Object.entries(dto)) {
            if(!propertiesToSkip.includes(key))
            {
                NetworkHydrator.mapProperty(key, dto, domainObject);
            }
        }
    }

    static mapProperty(property: string, dto: any, domainObject:any){
        if(dto[property] === undefined)
            return;

        domainObject[property] = dto[property];
    }
}
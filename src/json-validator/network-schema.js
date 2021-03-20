"use strict";
module.exports = validate20;
module.exports.default = validate20;
const schema22 = {"$ref":"#/definitions/Network","$schema":"http://json-schema.org/draft-07/schema#","definitions":{"Network":{"properties":{"time":{"format":"date-time","type":"string"},"statistics":{"$ref":"#/definitions/NetworkStatistics"},"id":{"type":"string"},"name":{"type":"string"},"nodes":{"items":{"$ref":"#/definitions/Node"},"type":"array"},"organizations":{"items":{"$ref":"#/definitions/Organization"},"type":"array"},"transitiveQuorumSet":{"items":{"type":"string"},"type":"array"},"scc":{"items":{"type":"array","items":{"type":"string"}},"type":"array"}},"type":"object","required":["nodes"]},"Node":{"properties":{"active":{"default":false,"type":"boolean"},"alias":{"type":"string"},"dateDiscovered":{"format":"date-time","type":"string"},"dateUpdated":{"format":"date-time","type":"string"},"displayName":{"type":"string"},"geoData":{"$ref":"#/definitions/NodeGeoData"},"historyUrl":{"type":"string"},"homeDomain":{"type":"string"},"host":{"type":"string"},"index":{"default":0,"type":"number"},"ip":{"default":"127.0.0.1","type":"string"},"isFullValidator":{"default":false,"type":"boolean"},"isValidating":{"default":false,"type":"boolean"},"isValidator":{"type":"boolean"},"isp":{"type":"string"},"key":{"type":"string"},"ledgerVersion":{"type":"string"},"name":{"type":"string"},"networkId":{"type":"string"},"organizationId":{"type":"string"},"overLoaded":{"default":false,"type":"boolean"},"overlayMinVersion":{"type":"string"},"overlayVersion":{"type":"string"},"port":{"type":"number"},"publicKey":{"type":"string"},"quorumSet":{"$ref":"#/definitions/QuorumSet"},"statistics":{"$ref":"#/definitions/NodeStatistics"},"versionStr":{"type":"string"}},"type":"object","required":["publicKey"]},"NodeGeoData":{"properties":{"countryCode":{"type":"string"},"countryName":{"type":"string"},"latitude":{"type":"number"},"longitude":{"type":"number"}},"type":"object"},"NodeStatistics":{"properties":{"active24HoursPercentage":{"default":0,"type":"number"},"active30DaysPercentage":{"default":0,"type":"number"},"has24HourStats":{"default":false,"type":"boolean"},"has30DayStats":{"default":false,"type":"boolean"},"overLoaded24HoursPercentage":{"default":0,"type":"number"},"overLoaded30DaysPercentage":{"default":0,"type":"number"},"validating24HoursPercentage":{"default":0,"type":"number"},"validating30DaysPercentage":{"default":0,"type":"number"}},"type":"object"},"Organization":{"properties":{"dateDiscovered":{"format":"date-time","type":"string"},"dba":{"type":"string"},"description":{"type":"string"},"github":{"type":"string"},"has24HourStats":{"default":false,"type":"boolean"},"has30DayStats":{"default":false,"type":"boolean"},"horizonUrl":{"type":"string"},"id":{"type":"string"},"isTierOneOrganization":{"type":"boolean"},"keybase":{"type":"string"},"logo":{"type":"string"},"name":{"type":"string"},"officialEmail":{"type":"string"},"phoneNumber":{"type":"string"},"physicalAddress":{"type":"string"},"subQuorum24HoursAvailability":{"default":0,"type":"number"},"subQuorum30DaysAvailability":{"default":0,"type":"number"},"subQuorumAvailable":{"default":false,"type":"boolean"},"twitter":{"type":"string"},"url":{"type":"string"},"validators":{"default":[],"items":{"type":"string"},"type":"array"}},"type":"object","required":["id","name","validators"]},"QuorumSet":{"properties":{"hashKey":{"type":"string"},"innerQuorumSets":{"items":{"$ref":"#/definitions/QuorumSet"},"type":"array"},"threshold":{"type":"number"},"validators":{"items":{"type":"string"},"type":"array"}},"type":"object","required":["threshold","validators","innerQuorumSets"]},"NetworkStatistics":{"properties":{"hasQuorumIntersection":{"type":"boolean"},"hasTransitiveQuorumSet":{"default":false,"type":"boolean"},"minBlockingSetFilteredSize":{"default":0,"type":"number"},"minBlockingSetOrgsFilteredSize":{"type":"number"},"minBlockingSetOrgsSize":{"type":"number"},"minBlockingSetSize":{"type":"number"},"minSplittingSetOrgsSize":{"type":"number"},"minSplittingSetSize":{"type":"number"},"nrOfActiveFullValidators":{"default":0,"type":"number"},"nrOfActiveOrganizations":{"default":0,"type":"number"},"nrOfActiveValidators":{"default":0,"type":"number"},"nrOfActiveWatchers":{"default":0,"type":"number"},"time":{"format":"date-time","type":"string"},"topTierFilteredSize":{"type":"number"},"topTierOrgsFilteredSize":{"type":"number"},"topTierOrgsSize":{"type":"number"},"topTierSize":{"type":"number"},"transitiveQuorumSetSize":{"default":0,"type":"number"}},"type":"object"},"default":{"$ref":"#/definitions/Network"}}};
const schema23 = {"properties":{"time":{"format":"date-time","type":"string"},"statistics":{"$ref":"#/definitions/NetworkStatistics"},"id":{"type":"string"},"name":{"type":"string"},"nodes":{"items":{"$ref":"#/definitions/Node"},"type":"array"},"organizations":{"items":{"$ref":"#/definitions/Organization"},"type":"array"},"transitiveQuorumSet":{"items":{"type":"string"},"type":"array"},"scc":{"items":{"type":"array","items":{"type":"string"}},"type":"array"}},"type":"object","required":["nodes"]};
const schema24 = {"properties":{"hasQuorumIntersection":{"type":"boolean"},"hasTransitiveQuorumSet":{"default":false,"type":"boolean"},"minBlockingSetFilteredSize":{"default":0,"type":"number"},"minBlockingSetOrgsFilteredSize":{"type":"number"},"minBlockingSetOrgsSize":{"type":"number"},"minBlockingSetSize":{"type":"number"},"minSplittingSetOrgsSize":{"type":"number"},"minSplittingSetSize":{"type":"number"},"nrOfActiveFullValidators":{"default":0,"type":"number"},"nrOfActiveOrganizations":{"default":0,"type":"number"},"nrOfActiveValidators":{"default":0,"type":"number"},"nrOfActiveWatchers":{"default":0,"type":"number"},"time":{"format":"date-time","type":"string"},"topTierFilteredSize":{"type":"number"},"topTierOrgsFilteredSize":{"type":"number"},"topTierOrgsSize":{"type":"number"},"topTierSize":{"type":"number"},"transitiveQuorumSetSize":{"default":0,"type":"number"}},"type":"object"};
const schema29 = {"properties":{"dateDiscovered":{"format":"date-time","type":"string"},"dba":{"type":"string"},"description":{"type":"string"},"github":{"type":"string"},"has24HourStats":{"default":false,"type":"boolean"},"has30DayStats":{"default":false,"type":"boolean"},"horizonUrl":{"type":"string"},"id":{"type":"string"},"isTierOneOrganization":{"type":"boolean"},"keybase":{"type":"string"},"logo":{"type":"string"},"name":{"type":"string"},"officialEmail":{"type":"string"},"phoneNumber":{"type":"string"},"physicalAddress":{"type":"string"},"subQuorum24HoursAvailability":{"default":0,"type":"number"},"subQuorum30DaysAvailability":{"default":0,"type":"number"},"subQuorumAvailable":{"default":false,"type":"boolean"},"twitter":{"type":"string"},"url":{"type":"string"},"validators":{"default":[],"items":{"type":"string"},"type":"array"}},"type":"object","required":["id","name","validators"]};
const formats0 = require("ajv-formats/dist/formats").fullFormats["date-time"];
const schema25 = {"properties":{"active":{"default":false,"type":"boolean"},"alias":{"type":"string"},"dateDiscovered":{"format":"date-time","type":"string"},"dateUpdated":{"format":"date-time","type":"string"},"displayName":{"type":"string"},"geoData":{"$ref":"#/definitions/NodeGeoData"},"historyUrl":{"type":"string"},"homeDomain":{"type":"string"},"host":{"type":"string"},"index":{"default":0,"type":"number"},"ip":{"default":"127.0.0.1","type":"string"},"isFullValidator":{"default":false,"type":"boolean"},"isValidating":{"default":false,"type":"boolean"},"isValidator":{"type":"boolean"},"isp":{"type":"string"},"key":{"type":"string"},"ledgerVersion":{"type":"string"},"name":{"type":"string"},"networkId":{"type":"string"},"organizationId":{"type":"string"},"overLoaded":{"default":false,"type":"boolean"},"overlayMinVersion":{"type":"string"},"overlayVersion":{"type":"string"},"port":{"type":"number"},"publicKey":{"type":"string"},"quorumSet":{"$ref":"#/definitions/QuorumSet"},"statistics":{"$ref":"#/definitions/NodeStatistics"},"versionStr":{"type":"string"}},"type":"object","required":["publicKey"]};
const schema26 = {"properties":{"countryCode":{"type":"string"},"countryName":{"type":"string"},"latitude":{"type":"number"},"longitude":{"type":"number"}},"type":"object"};
const schema28 = {"properties":{"active24HoursPercentage":{"default":0,"type":"number"},"active30DaysPercentage":{"default":0,"type":"number"},"has24HourStats":{"default":false,"type":"boolean"},"has30DayStats":{"default":false,"type":"boolean"},"overLoaded24HoursPercentage":{"default":0,"type":"number"},"overLoaded30DaysPercentage":{"default":0,"type":"number"},"validating24HoursPercentage":{"default":0,"type":"number"},"validating30DaysPercentage":{"default":0,"type":"number"}},"type":"object"};
const schema27 = {"properties":{"hashKey":{"type":"string"},"innerQuorumSets":{"items":{"$ref":"#/definitions/QuorumSet"},"type":"array"},"threshold":{"type":"number"},"validators":{"items":{"type":"string"},"type":"array"}},"type":"object","required":["threshold","validators","innerQuorumSets"]};
const wrapper0 = {validate: validate23};

function validate23(data, {dataPath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((((data.threshold === undefined) && (missing0 = "threshold")) || ((data.validators === undefined) && (missing0 = "validators"))) || ((data.innerQuorumSets === undefined) && (missing0 = "innerQuorumSets"))){
validate23.errors = [{keyword:"required",dataPath,schemaPath:"#/required",params:{missingProperty: missing0},message:"should have required property '"+missing0+"'"}];
return false;
}
else {
if(data.hashKey !== undefined){
const _errs1 = errors;
if(typeof data.hashKey !== "string"){
validate23.errors = [{keyword:"type",dataPath:dataPath+"/hashKey",schemaPath:"#/properties/hashKey/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.innerQuorumSets !== undefined){
let data1 = data.innerQuorumSets;
const _errs3 = errors;
if(errors === _errs3){
if(Array.isArray(data1)){
var valid1 = true;
const len0 = data1.length;
for(let i0=0; i0<len0; i0++){
const _errs5 = errors;
if(!(wrapper0.validate(data1[i0], {dataPath:dataPath+"/innerQuorumSets/" + i0,parentData:data1,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? wrapper0.validate.errors : vErrors.concat(wrapper0.validate.errors);
errors = vErrors.length;
}
var valid1 = _errs5 === errors;
if(!valid1){
break;
}
}
}
else {
validate23.errors = [{keyword:"type",dataPath:dataPath+"/innerQuorumSets",schemaPath:"#/properties/innerQuorumSets/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.threshold !== undefined){
let data3 = data.threshold;
const _errs6 = errors;
if(!((typeof data3 == "number") && (isFinite(data3)))){
validate23.errors = [{keyword:"type",dataPath:dataPath+"/threshold",schemaPath:"#/properties/threshold/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid0 = _errs6 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.validators !== undefined){
let data4 = data.validators;
const _errs8 = errors;
if(errors === _errs8){
if(Array.isArray(data4)){
var valid2 = true;
const len1 = data4.length;
for(let i1=0; i1<len1; i1++){
const _errs10 = errors;
if(typeof data4[i1] !== "string"){
validate23.errors = [{keyword:"type",dataPath:dataPath+"/validators/" + i1,schemaPath:"#/properties/validators/items/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid2 = _errs10 === errors;
if(!valid2){
break;
}
}
}
else {
validate23.errors = [{keyword:"type",dataPath:dataPath+"/validators",schemaPath:"#/properties/validators/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid0 = _errs8 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
else {
validate23.errors = [{keyword:"type",dataPath,schemaPath:"#/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
validate23.errors = vErrors;
return errors === 0;
}


function validate22(data, {dataPath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.publicKey === undefined) && (missing0 = "publicKey")){
validate22.errors = [{keyword:"required",dataPath,schemaPath:"#/required",params:{missingProperty: missing0},message:"should have required property '"+missing0+"'"}];
return false;
}
else {
if(data.active !== undefined){
const _errs1 = errors;
if(typeof data.active !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/active",schemaPath:"#/properties/active/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.alias !== undefined){
const _errs3 = errors;
if(typeof data.alias !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/alias",schemaPath:"#/properties/alias/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.dateDiscovered !== undefined){
let data2 = data.dateDiscovered;
const _errs5 = errors;
if(errors === _errs5){
if(errors === _errs5){
if(typeof data2 === "string"){
if(!(formats0.validate(data2))){
validate22.errors = [{keyword:"format",dataPath:dataPath+"/dateDiscovered",schemaPath:"#/properties/dateDiscovered/format",params:{format: "date-time"},message:"should match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate22.errors = [{keyword:"type",dataPath:dataPath+"/dateDiscovered",schemaPath:"#/properties/dateDiscovered/type",params:{type: "string"},message:"should be string"}];
return false;
}
}
}
var valid0 = _errs5 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.dateUpdated !== undefined){
let data3 = data.dateUpdated;
const _errs7 = errors;
if(errors === _errs7){
if(errors === _errs7){
if(typeof data3 === "string"){
if(!(formats0.validate(data3))){
validate22.errors = [{keyword:"format",dataPath:dataPath+"/dateUpdated",schemaPath:"#/properties/dateUpdated/format",params:{format: "date-time"},message:"should match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate22.errors = [{keyword:"type",dataPath:dataPath+"/dateUpdated",schemaPath:"#/properties/dateUpdated/type",params:{type: "string"},message:"should be string"}];
return false;
}
}
}
var valid0 = _errs7 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.displayName !== undefined){
const _errs9 = errors;
if(typeof data.displayName !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/displayName",schemaPath:"#/properties/displayName/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs9 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.geoData !== undefined){
let data5 = data.geoData;
const _errs11 = errors;
const _errs12 = errors;
if(errors === _errs12){
if(data5 && typeof data5 == "object" && !Array.isArray(data5)){
if(data5.countryCode !== undefined){
const _errs14 = errors;
if(typeof data5.countryCode !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/geoData/countryCode",schemaPath:"#/definitions/NodeGeoData/properties/countryCode/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data5.countryName !== undefined){
const _errs16 = errors;
if(typeof data5.countryName !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/geoData/countryName",schemaPath:"#/definitions/NodeGeoData/properties/countryName/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid2 = _errs16 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data5.latitude !== undefined){
let data8 = data5.latitude;
const _errs18 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/geoData/latitude",schemaPath:"#/definitions/NodeGeoData/properties/latitude/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs18 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data5.longitude !== undefined){
let data9 = data5.longitude;
const _errs20 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/geoData/longitude",schemaPath:"#/definitions/NodeGeoData/properties/longitude/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
else {
validate22.errors = [{keyword:"type",dataPath:dataPath+"/geoData",schemaPath:"#/definitions/NodeGeoData/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
var valid0 = _errs11 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.historyUrl !== undefined){
const _errs22 = errors;
if(typeof data.historyUrl !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/historyUrl",schemaPath:"#/properties/historyUrl/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs22 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.homeDomain !== undefined){
const _errs24 = errors;
if(typeof data.homeDomain !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/homeDomain",schemaPath:"#/properties/homeDomain/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs24 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.host !== undefined){
const _errs26 = errors;
if(typeof data.host !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/host",schemaPath:"#/properties/host/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs26 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.index !== undefined){
let data13 = data.index;
const _errs28 = errors;
if(!((typeof data13 == "number") && (isFinite(data13)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/index",schemaPath:"#/properties/index/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid0 = _errs28 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ip !== undefined){
const _errs30 = errors;
if(typeof data.ip !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/ip",schemaPath:"#/properties/ip/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs30 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.isFullValidator !== undefined){
const _errs32 = errors;
if(typeof data.isFullValidator !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/isFullValidator",schemaPath:"#/properties/isFullValidator/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid0 = _errs32 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.isValidating !== undefined){
const _errs34 = errors;
if(typeof data.isValidating !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/isValidating",schemaPath:"#/properties/isValidating/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid0 = _errs34 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.isValidator !== undefined){
const _errs36 = errors;
if(typeof data.isValidator !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/isValidator",schemaPath:"#/properties/isValidator/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid0 = _errs36 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.isp !== undefined){
const _errs38 = errors;
if(typeof data.isp !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/isp",schemaPath:"#/properties/isp/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs38 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.key !== undefined){
const _errs40 = errors;
if(typeof data.key !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/key",schemaPath:"#/properties/key/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs40 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.ledgerVersion !== undefined){
const _errs42 = errors;
if(typeof data.ledgerVersion !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/ledgerVersion",schemaPath:"#/properties/ledgerVersion/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs42 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
const _errs44 = errors;
if(typeof data.name !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/name",schemaPath:"#/properties/name/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.networkId !== undefined){
const _errs46 = errors;
if(typeof data.networkId !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/networkId",schemaPath:"#/properties/networkId/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.organizationId !== undefined){
const _errs48 = errors;
if(typeof data.organizationId !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/organizationId",schemaPath:"#/properties/organizationId/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs48 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.overLoaded !== undefined){
const _errs50 = errors;
if(typeof data.overLoaded !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/overLoaded",schemaPath:"#/properties/overLoaded/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid0 = _errs50 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.overlayMinVersion !== undefined){
const _errs52 = errors;
if(typeof data.overlayMinVersion !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/overlayMinVersion",schemaPath:"#/properties/overlayMinVersion/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs52 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.overlayVersion !== undefined){
const _errs54 = errors;
if(typeof data.overlayVersion !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/overlayVersion",schemaPath:"#/properties/overlayVersion/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs54 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.port !== undefined){
let data27 = data.port;
const _errs56 = errors;
if(!((typeof data27 == "number") && (isFinite(data27)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/port",schemaPath:"#/properties/port/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid0 = _errs56 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.publicKey !== undefined){
const _errs58 = errors;
if(typeof data.publicKey !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/publicKey",schemaPath:"#/properties/publicKey/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs58 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.quorumSet !== undefined){
const _errs60 = errors;
if(!(validate23(data.quorumSet, {dataPath:dataPath+"/quorumSet",parentData:data,parentDataProperty:"quorumSet",rootData}))){
vErrors = vErrors === null ? validate23.errors : vErrors.concat(validate23.errors);
errors = vErrors.length;
}
var valid0 = _errs60 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.statistics !== undefined){
let data30 = data.statistics;
const _errs61 = errors;
const _errs62 = errors;
if(errors === _errs62){
if(data30 && typeof data30 == "object" && !Array.isArray(data30)){
if(data30.active24HoursPercentage !== undefined){
let data31 = data30.active24HoursPercentage;
const _errs64 = errors;
if(!((typeof data31 == "number") && (isFinite(data31)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/active24HoursPercentage",schemaPath:"#/definitions/NodeStatistics/properties/active24HoursPercentage/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid4 = _errs64 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.active30DaysPercentage !== undefined){
let data32 = data30.active30DaysPercentage;
const _errs66 = errors;
if(!((typeof data32 == "number") && (isFinite(data32)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/active30DaysPercentage",schemaPath:"#/definitions/NodeStatistics/properties/active30DaysPercentage/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid4 = _errs66 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.has24HourStats !== undefined){
const _errs68 = errors;
if(typeof data30.has24HourStats !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/has24HourStats",schemaPath:"#/definitions/NodeStatistics/properties/has24HourStats/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid4 = _errs68 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.has30DayStats !== undefined){
const _errs70 = errors;
if(typeof data30.has30DayStats !== "boolean"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/has30DayStats",schemaPath:"#/definitions/NodeStatistics/properties/has30DayStats/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid4 = _errs70 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.overLoaded24HoursPercentage !== undefined){
let data35 = data30.overLoaded24HoursPercentage;
const _errs72 = errors;
if(!((typeof data35 == "number") && (isFinite(data35)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/overLoaded24HoursPercentage",schemaPath:"#/definitions/NodeStatistics/properties/overLoaded24HoursPercentage/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid4 = _errs72 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.overLoaded30DaysPercentage !== undefined){
let data36 = data30.overLoaded30DaysPercentage;
const _errs74 = errors;
if(!((typeof data36 == "number") && (isFinite(data36)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/overLoaded30DaysPercentage",schemaPath:"#/definitions/NodeStatistics/properties/overLoaded30DaysPercentage/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid4 = _errs74 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.validating24HoursPercentage !== undefined){
let data37 = data30.validating24HoursPercentage;
const _errs76 = errors;
if(!((typeof data37 == "number") && (isFinite(data37)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/validating24HoursPercentage",schemaPath:"#/definitions/NodeStatistics/properties/validating24HoursPercentage/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid4 = _errs76 === errors;
}
else {
var valid4 = true;
}
if(valid4){
if(data30.validating30DaysPercentage !== undefined){
let data38 = data30.validating30DaysPercentage;
const _errs78 = errors;
if(!((typeof data38 == "number") && (isFinite(data38)))){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics/validating30DaysPercentage",schemaPath:"#/definitions/NodeStatistics/properties/validating30DaysPercentage/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid4 = _errs78 === errors;
}
else {
var valid4 = true;
}
}
}
}
}
}
}
}
}
else {
validate22.errors = [{keyword:"type",dataPath:dataPath+"/statistics",schemaPath:"#/definitions/NodeStatistics/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
var valid0 = _errs61 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.versionStr !== undefined){
const _errs80 = errors;
if(typeof data.versionStr !== "string"){
validate22.errors = [{keyword:"type",dataPath:dataPath+"/versionStr",schemaPath:"#/properties/versionStr/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs80 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate22.errors = [{keyword:"type",dataPath,schemaPath:"#/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
validate22.errors = vErrors;
return errors === 0;
}


function validate21(data, {dataPath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(errors === 0){
if(data && typeof data == "object" && !Array.isArray(data)){
let missing0;
if((data.nodes === undefined) && (missing0 = "nodes")){
validate21.errors = [{keyword:"required",dataPath,schemaPath:"#/required",params:{missingProperty: missing0},message:"should have required property '"+missing0+"'"}];
return false;
}
else {
if(data.time !== undefined){
let data0 = data.time;
const _errs1 = errors;
if(errors === _errs1){
if(errors === _errs1){
if(typeof data0 === "string"){
if(!(formats0.validate(data0))){
validate21.errors = [{keyword:"format",dataPath:dataPath+"/time",schemaPath:"#/properties/time/format",params:{format: "date-time"},message:"should match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/time",schemaPath:"#/properties/time/type",params:{type: "string"},message:"should be string"}];
return false;
}
}
}
var valid0 = _errs1 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.statistics !== undefined){
let data1 = data.statistics;
const _errs3 = errors;
const _errs4 = errors;
if(errors === _errs4){
if(data1 && typeof data1 == "object" && !Array.isArray(data1)){
if(data1.hasQuorumIntersection !== undefined){
const _errs6 = errors;
if(typeof data1.hasQuorumIntersection !== "boolean"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/hasQuorumIntersection",schemaPath:"#/definitions/NetworkStatistics/properties/hasQuorumIntersection/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid2 = _errs6 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.hasTransitiveQuorumSet !== undefined){
const _errs8 = errors;
if(typeof data1.hasTransitiveQuorumSet !== "boolean"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/hasTransitiveQuorumSet",schemaPath:"#/definitions/NetworkStatistics/properties/hasTransitiveQuorumSet/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid2 = _errs8 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.minBlockingSetFilteredSize !== undefined){
let data4 = data1.minBlockingSetFilteredSize;
const _errs10 = errors;
if(!((typeof data4 == "number") && (isFinite(data4)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/minBlockingSetFilteredSize",schemaPath:"#/definitions/NetworkStatistics/properties/minBlockingSetFilteredSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs10 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.minBlockingSetOrgsFilteredSize !== undefined){
let data5 = data1.minBlockingSetOrgsFilteredSize;
const _errs12 = errors;
if(!((typeof data5 == "number") && (isFinite(data5)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/minBlockingSetOrgsFilteredSize",schemaPath:"#/definitions/NetworkStatistics/properties/minBlockingSetOrgsFilteredSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs12 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.minBlockingSetOrgsSize !== undefined){
let data6 = data1.minBlockingSetOrgsSize;
const _errs14 = errors;
if(!((typeof data6 == "number") && (isFinite(data6)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/minBlockingSetOrgsSize",schemaPath:"#/definitions/NetworkStatistics/properties/minBlockingSetOrgsSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs14 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.minBlockingSetSize !== undefined){
let data7 = data1.minBlockingSetSize;
const _errs16 = errors;
if(!((typeof data7 == "number") && (isFinite(data7)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/minBlockingSetSize",schemaPath:"#/definitions/NetworkStatistics/properties/minBlockingSetSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs16 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.minSplittingSetOrgsSize !== undefined){
let data8 = data1.minSplittingSetOrgsSize;
const _errs18 = errors;
if(!((typeof data8 == "number") && (isFinite(data8)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/minSplittingSetOrgsSize",schemaPath:"#/definitions/NetworkStatistics/properties/minSplittingSetOrgsSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs18 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.minSplittingSetSize !== undefined){
let data9 = data1.minSplittingSetSize;
const _errs20 = errors;
if(!((typeof data9 == "number") && (isFinite(data9)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/minSplittingSetSize",schemaPath:"#/definitions/NetworkStatistics/properties/minSplittingSetSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs20 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.nrOfActiveFullValidators !== undefined){
let data10 = data1.nrOfActiveFullValidators;
const _errs22 = errors;
if(!((typeof data10 == "number") && (isFinite(data10)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/nrOfActiveFullValidators",schemaPath:"#/definitions/NetworkStatistics/properties/nrOfActiveFullValidators/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs22 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.nrOfActiveOrganizations !== undefined){
let data11 = data1.nrOfActiveOrganizations;
const _errs24 = errors;
if(!((typeof data11 == "number") && (isFinite(data11)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/nrOfActiveOrganizations",schemaPath:"#/definitions/NetworkStatistics/properties/nrOfActiveOrganizations/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs24 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.nrOfActiveValidators !== undefined){
let data12 = data1.nrOfActiveValidators;
const _errs26 = errors;
if(!((typeof data12 == "number") && (isFinite(data12)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/nrOfActiveValidators",schemaPath:"#/definitions/NetworkStatistics/properties/nrOfActiveValidators/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs26 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.nrOfActiveWatchers !== undefined){
let data13 = data1.nrOfActiveWatchers;
const _errs28 = errors;
if(!((typeof data13 == "number") && (isFinite(data13)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/nrOfActiveWatchers",schemaPath:"#/definitions/NetworkStatistics/properties/nrOfActiveWatchers/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs28 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.time !== undefined){
let data14 = data1.time;
const _errs30 = errors;
if(errors === _errs30){
if(errors === _errs30){
if(typeof data14 === "string"){
if(!(formats0.validate(data14))){
validate21.errors = [{keyword:"format",dataPath:dataPath+"/statistics/time",schemaPath:"#/definitions/NetworkStatistics/properties/time/format",params:{format: "date-time"},message:"should match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/time",schemaPath:"#/definitions/NetworkStatistics/properties/time/type",params:{type: "string"},message:"should be string"}];
return false;
}
}
}
var valid2 = _errs30 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.topTierFilteredSize !== undefined){
let data15 = data1.topTierFilteredSize;
const _errs32 = errors;
if(!((typeof data15 == "number") && (isFinite(data15)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/topTierFilteredSize",schemaPath:"#/definitions/NetworkStatistics/properties/topTierFilteredSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs32 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.topTierOrgsFilteredSize !== undefined){
let data16 = data1.topTierOrgsFilteredSize;
const _errs34 = errors;
if(!((typeof data16 == "number") && (isFinite(data16)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/topTierOrgsFilteredSize",schemaPath:"#/definitions/NetworkStatistics/properties/topTierOrgsFilteredSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs34 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.topTierOrgsSize !== undefined){
let data17 = data1.topTierOrgsSize;
const _errs36 = errors;
if(!((typeof data17 == "number") && (isFinite(data17)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/topTierOrgsSize",schemaPath:"#/definitions/NetworkStatistics/properties/topTierOrgsSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs36 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.topTierSize !== undefined){
let data18 = data1.topTierSize;
const _errs38 = errors;
if(!((typeof data18 == "number") && (isFinite(data18)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/topTierSize",schemaPath:"#/definitions/NetworkStatistics/properties/topTierSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs38 === errors;
}
else {
var valid2 = true;
}
if(valid2){
if(data1.transitiveQuorumSetSize !== undefined){
let data19 = data1.transitiveQuorumSetSize;
const _errs40 = errors;
if(!((typeof data19 == "number") && (isFinite(data19)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics/transitiveQuorumSetSize",schemaPath:"#/definitions/NetworkStatistics/properties/transitiveQuorumSetSize/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid2 = _errs40 === errors;
}
else {
var valid2 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/statistics",schemaPath:"#/definitions/NetworkStatistics/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
var valid0 = _errs3 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.id !== undefined){
const _errs42 = errors;
if(typeof data.id !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/id",schemaPath:"#/properties/id/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs42 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.name !== undefined){
const _errs44 = errors;
if(typeof data.name !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/name",schemaPath:"#/properties/name/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid0 = _errs44 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.nodes !== undefined){
let data22 = data.nodes;
const _errs46 = errors;
if(errors === _errs46){
if(Array.isArray(data22)){
var valid3 = true;
const len0 = data22.length;
for(let i0=0; i0<len0; i0++){
const _errs48 = errors;
if(!(validate22(data22[i0], {dataPath:dataPath+"/nodes/" + i0,parentData:data22,parentDataProperty:i0,rootData}))){
vErrors = vErrors === null ? validate22.errors : vErrors.concat(validate22.errors);
errors = vErrors.length;
}
var valid3 = _errs48 === errors;
if(!valid3){
break;
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/nodes",schemaPath:"#/properties/nodes/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid0 = _errs46 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.organizations !== undefined){
let data24 = data.organizations;
const _errs49 = errors;
if(errors === _errs49){
if(Array.isArray(data24)){
var valid4 = true;
const len1 = data24.length;
for(let i1=0; i1<len1; i1++){
let data25 = data24[i1];
const _errs51 = errors;
const _errs52 = errors;
if(errors === _errs52){
if(data25 && typeof data25 == "object" && !Array.isArray(data25)){
let missing1;
if((((data25.id === undefined) && (missing1 = "id")) || ((data25.name === undefined) && (missing1 = "name"))) || ((data25.validators === undefined) && (missing1 = "validators"))){
validate21.errors = [{keyword:"required",dataPath:dataPath+"/organizations/" + i1,schemaPath:"#/definitions/Organization/required",params:{missingProperty: missing1},message:"should have required property '"+missing1+"'"}];
return false;
}
else {
if(data25.dateDiscovered !== undefined){
let data26 = data25.dateDiscovered;
const _errs54 = errors;
if(errors === _errs54){
if(errors === _errs54){
if(typeof data26 === "string"){
if(!(formats0.validate(data26))){
validate21.errors = [{keyword:"format",dataPath:dataPath+"/organizations/" + i1+"/dateDiscovered",schemaPath:"#/definitions/Organization/properties/dateDiscovered/format",params:{format: "date-time"},message:"should match format \""+"date-time"+"\""}];
return false;
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/dateDiscovered",schemaPath:"#/definitions/Organization/properties/dateDiscovered/type",params:{type: "string"},message:"should be string"}];
return false;
}
}
}
var valid6 = _errs54 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.dba !== undefined){
const _errs56 = errors;
if(typeof data25.dba !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/dba",schemaPath:"#/definitions/Organization/properties/dba/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs56 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.description !== undefined){
const _errs58 = errors;
if(typeof data25.description !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/description",schemaPath:"#/definitions/Organization/properties/description/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs58 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.github !== undefined){
const _errs60 = errors;
if(typeof data25.github !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/github",schemaPath:"#/definitions/Organization/properties/github/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs60 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.has24HourStats !== undefined){
const _errs62 = errors;
if(typeof data25.has24HourStats !== "boolean"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/has24HourStats",schemaPath:"#/definitions/Organization/properties/has24HourStats/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid6 = _errs62 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.has30DayStats !== undefined){
const _errs64 = errors;
if(typeof data25.has30DayStats !== "boolean"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/has30DayStats",schemaPath:"#/definitions/Organization/properties/has30DayStats/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid6 = _errs64 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.horizonUrl !== undefined){
const _errs66 = errors;
if(typeof data25.horizonUrl !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/horizonUrl",schemaPath:"#/definitions/Organization/properties/horizonUrl/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs66 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.id !== undefined){
const _errs68 = errors;
if(typeof data25.id !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/id",schemaPath:"#/definitions/Organization/properties/id/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs68 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.isTierOneOrganization !== undefined){
const _errs70 = errors;
if(typeof data25.isTierOneOrganization !== "boolean"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/isTierOneOrganization",schemaPath:"#/definitions/Organization/properties/isTierOneOrganization/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid6 = _errs70 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.keybase !== undefined){
const _errs72 = errors;
if(typeof data25.keybase !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/keybase",schemaPath:"#/definitions/Organization/properties/keybase/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs72 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.logo !== undefined){
const _errs74 = errors;
if(typeof data25.logo !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/logo",schemaPath:"#/definitions/Organization/properties/logo/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs74 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.name !== undefined){
const _errs76 = errors;
if(typeof data25.name !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/name",schemaPath:"#/definitions/Organization/properties/name/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs76 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.officialEmail !== undefined){
const _errs78 = errors;
if(typeof data25.officialEmail !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/officialEmail",schemaPath:"#/definitions/Organization/properties/officialEmail/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs78 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.phoneNumber !== undefined){
const _errs80 = errors;
if(typeof data25.phoneNumber !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/phoneNumber",schemaPath:"#/definitions/Organization/properties/phoneNumber/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs80 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.physicalAddress !== undefined){
const _errs82 = errors;
if(typeof data25.physicalAddress !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/physicalAddress",schemaPath:"#/definitions/Organization/properties/physicalAddress/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs82 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.subQuorum24HoursAvailability !== undefined){
let data41 = data25.subQuorum24HoursAvailability;
const _errs84 = errors;
if(!((typeof data41 == "number") && (isFinite(data41)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/subQuorum24HoursAvailability",schemaPath:"#/definitions/Organization/properties/subQuorum24HoursAvailability/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid6 = _errs84 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.subQuorum30DaysAvailability !== undefined){
let data42 = data25.subQuorum30DaysAvailability;
const _errs86 = errors;
if(!((typeof data42 == "number") && (isFinite(data42)))){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/subQuorum30DaysAvailability",schemaPath:"#/definitions/Organization/properties/subQuorum30DaysAvailability/type",params:{type: "number"},message:"should be number"}];
return false;
}
var valid6 = _errs86 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.subQuorumAvailable !== undefined){
const _errs88 = errors;
if(typeof data25.subQuorumAvailable !== "boolean"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/subQuorumAvailable",schemaPath:"#/definitions/Organization/properties/subQuorumAvailable/type",params:{type: "boolean"},message:"should be boolean"}];
return false;
}
var valid6 = _errs88 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.twitter !== undefined){
const _errs90 = errors;
if(typeof data25.twitter !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/twitter",schemaPath:"#/definitions/Organization/properties/twitter/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs90 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.url !== undefined){
const _errs92 = errors;
if(typeof data25.url !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/url",schemaPath:"#/definitions/Organization/properties/url/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid6 = _errs92 === errors;
}
else {
var valid6 = true;
}
if(valid6){
if(data25.validators !== undefined){
let data46 = data25.validators;
const _errs94 = errors;
if(errors === _errs94){
if(Array.isArray(data46)){
var valid7 = true;
const len2 = data46.length;
for(let i2=0; i2<len2; i2++){
const _errs96 = errors;
if(typeof data46[i2] !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/validators/" + i2,schemaPath:"#/definitions/Organization/properties/validators/items/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid7 = _errs96 === errors;
if(!valid7){
break;
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1+"/validators",schemaPath:"#/definitions/Organization/properties/validators/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid6 = _errs94 === errors;
}
else {
var valid6 = true;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations/" + i1,schemaPath:"#/definitions/Organization/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
var valid4 = _errs51 === errors;
if(!valid4){
break;
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/organizations",schemaPath:"#/properties/organizations/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid0 = _errs49 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.transitiveQuorumSet !== undefined){
let data48 = data.transitiveQuorumSet;
const _errs98 = errors;
if(errors === _errs98){
if(Array.isArray(data48)){
var valid8 = true;
const len3 = data48.length;
for(let i3=0; i3<len3; i3++){
const _errs100 = errors;
if(typeof data48[i3] !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/transitiveQuorumSet/" + i3,schemaPath:"#/properties/transitiveQuorumSet/items/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid8 = _errs100 === errors;
if(!valid8){
break;
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/transitiveQuorumSet",schemaPath:"#/properties/transitiveQuorumSet/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid0 = _errs98 === errors;
}
else {
var valid0 = true;
}
if(valid0){
if(data.scc !== undefined){
let data50 = data.scc;
const _errs102 = errors;
if(errors === _errs102){
if(Array.isArray(data50)){
var valid9 = true;
const len4 = data50.length;
for(let i4=0; i4<len4; i4++){
let data51 = data50[i4];
const _errs104 = errors;
if(errors === _errs104){
if(Array.isArray(data51)){
var valid10 = true;
const len5 = data51.length;
for(let i5=0; i5<len5; i5++){
const _errs106 = errors;
if(typeof data51[i5] !== "string"){
validate21.errors = [{keyword:"type",dataPath:dataPath+"/scc/" + i4+"/" + i5,schemaPath:"#/properties/scc/items/items/type",params:{type: "string"},message:"should be string"}];
return false;
}
var valid10 = _errs106 === errors;
if(!valid10){
break;
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/scc/" + i4,schemaPath:"#/properties/scc/items/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid9 = _errs104 === errors;
if(!valid9){
break;
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath:dataPath+"/scc",schemaPath:"#/properties/scc/type",params:{type: "array"},message:"should be array"}];
return false;
}
}
var valid0 = _errs102 === errors;
}
else {
var valid0 = true;
}
}
}
}
}
}
}
}
}
}
else {
validate21.errors = [{keyword:"type",dataPath,schemaPath:"#/type",params:{type: "object"},message:"should be object"}];
return false;
}
}
validate21.errors = vErrors;
return errors === 0;
}


function validate20(data, {dataPath="", parentData, parentDataProperty, rootData=data}={}){
let vErrors = null;
let errors = 0;
if(!(validate21(data, {dataPath,parentData,parentDataProperty,rootData}))){
vErrors = vErrors === null ? validate21.errors : vErrors.concat(validate21.errors);
errors = vErrors.length;
}
validate20.errors = vErrors;
return errors === 0;
}

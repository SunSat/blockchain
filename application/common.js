'use strict';

/**
 * This is a Node.JS hello to add a new student on the network.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const contractHelper = require("./contractHelper");
let gateway;

async function registerCompany(companyCrn, companyName, location, organisationRole) {
    let contractObj;
    try {
        contractObj = await contractHelper.getCommonGatewayByOrgRole(organisationRole);
        const responseBuffer = await contractObj.contract.submitTransaction('registerCompany', companyCrn,companyName,location,organisationRole);
        // process response
        let responseObject = JSON.parse(responseBuffer.toString());
        return responseObject;
    } catch (error) {
        console.log(`error while invoking register company: \n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        // Disconnect from the fabric gateway
        console.log('.....Disconnecting from Fabric Gateway');
        await contractObj.commonGateway.disconnect();
    }
}

async function createShipment(organisationRole, buyerCrn, drugName, listOfAssets, transporterCrn) {
    let contractObj;
    try {
        contractObj = await contractHelper.getCommonGatewayByOrgRole(organisationRole);
        const studentBuffer = await contractObj.contract.submitTransaction('createShipment', buyerCrn,drugName,listOfAssets,transporterCrn);
        // process response
        let newStudent = JSON.parse(studentBuffer.toString());
        return newStudent;
    } catch (error) {
        console.log(`error while invoking registrator company: \n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        // Disconnect from the fabric gateway
        console.log('.....Disconnecting from Fabric Gateway');
        await contractObj.commonGateway.disconnect();
    }
}

async function updateShipment(organisationRole, buyerCrn, drugName, transporterCrn) {
    let contractObj;
    try {
        contractObj = await contractHelper.getCommonGatewayByOrgRole(organisationRole);
        const updateShipmentBuffer = await contractObj.contract.submitTransaction('updateShipment', buyerCrn,drugName,transporterCrn);
        let responseObj = JSON.parse(updateShipmentBuffer.toString());
        return responseObj;
    } catch (error) {
        console.log(`error while invoking registrator company: \n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        // Disconnect from the fabric gateway
        console.log('.....Disconnecting from Fabric Gateway');
        await contractObj.commonGateway.disconnect();
    }
}

async function retailDrug(organisationRole, drugName, serialNo, retailerCrn, customerAadhar) {
    let contractObj;
    try {
        contractObj = await contractHelper.getCommonGatewayByOrgRole(organisationRole);
        const retailDrugResponse = await contractObj.contract.submitTransaction('retailDrug', drugName,serialNo,retailerCrn,customerAadhar);
        let responseObj = JSON.parse(retailDrugResponse.toString());
        return responseObj;
    } catch (error) {
        console.log(`error while invoking retail drug: \n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        // Disconnect from the fabric gateway
        console.log('.....Disconnecting from Fabric Gateway');
        await contractObj.commonGateway.disconnect();
    }
}

async function viewHistory(organisationRole, drugName, serialNo) {
    let contractObj;
    try {
        contractObj = await contractHelper.getCommonGatewayByOrgRole(organisationRole);
        const viewHistory = await contractObj.contract.submitTransaction('viewHistory', drugName,serialNo);
        let responseObj = JSON.parse(viewHistory.toString());
        return responseObj;
    } catch (error) {
        console.log(`error while invoking retail drug: \n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        // Disconnect from the fabric gateway
        console.log('.....Disconnecting from Fabric Gateway');
        await contractObj.commonGateway.disconnect();
    }
}

async function viewDrugCurrentState(organisationRole, drugName, serialNo) {
    let contractObj;
    try {
        contractObj = await contractHelper.getCommonGatewayByOrgRole(organisationRole);
        const viewDrugCurrentState = await contractObj.contract.submitTransaction('viewDrugCurrentState', drugName,serialNo);
        let responseObj = JSON.parse(viewDrugCurrentState.toString());
        return responseObj;
    } catch (error) {
        console.log(`error while invoking retail drug: \n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        // Disconnect from the fabric gateway
        console.log('.....Disconnecting from Fabric Gateway');
        await contractObj.commonGateway.disconnect();
    }
}
module.exports.registerCompany = registerCompany;
module.exports.createShipment = createShipment;
module.exports.updateShipment = updateShipment;
module.exports.retailDrug = retailDrug;
module.exports.viewHistory = viewHistory;
module.exports.viewDrugCurrentState = viewDrugCurrentState;
'use strict';

/**
 * This is a Node.JS hello to add a new student on the network.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const contractHelper = require("./contractHelper");
let gateway;

async function createPo(organization, buyerCrn, sellerCrn, drugName, quantity) {

    let certnetContract;
    try {
        switch (organization) {
            case "distributor":
                certnetContract = await contractHelper.getDistributorContractInstance();
                break;
            case "retailer":
                certnetContract = await contractHelper.getRetailerContractInstance();
                break;
            default:
                throw new Error("Invalid Requestor. CreatePO can be called either Distributor Or Retailer.");
        }
        const responseBuffer = await certnetContract.contract.submitTransaction('createPO', buyerCrn,sellerCrn,drugName,quantity);
        let responseObj = JSON.parse(responseBuffer.toString());
        return responseObj;
    } catch (error) {
        console.log(`\n\n ${error} \n\n`);
        throw new Error(error);
    } finally {
        console.log('.....Disconnecting from Fabric Gateway');
        certnetContract.commonGateway.disconnect();
    }
}

module.exports.createPo = createPo;

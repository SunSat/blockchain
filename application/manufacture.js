'use strict';

/**
 * This is a Node.JS hello to add a new student on the network.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const contractHelper = require("./contractHelper");
let gateway;

async function addDrug(drugName, serialNo, mfgDate, expDate, companyCrn) {

	let certnetContract;
	try {
		certnetContract = await contractHelper.getManufacturerContractInstance();
		const resBuffer = await certnetContract.contract.submitTransaction('addDrug', drugName,serialNo,mfgDate,expDate,companyCrn);
		let responseObj = JSON.parse(resBuffer.toString());
		return responseObj;
	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	} finally {
		console.log('.....Disconnecting from Fabric Gateway');
		certnetContract.commonGateway.disconnect();
	}
}

module.exports.addDrug = addDrug;

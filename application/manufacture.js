'use strict';

/**
 * This is a Node.JS hello to add a new student on the network.
 */

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const contractHelper = require("./contractHelper");
let gateway;

async function addDrug(studentId, name, email) {

	try {
		const certnetContract = await contractHelper.getContractInstance();
		// Create a new student account
		console.log('.....Create a new Student account');
		const studentBuffer = await certnetContract.submitTransaction('addDrug', 'Corex','1','11-11-19','11-12-19','M-1');
		// process response
		console.log('.....Processing Create Student Transaction Response \n\n');
		let newStudent = JSON.parse(studentBuffer.toString());
		console.log(newStudent);
		console.log('\n\n.....Create Student Transaction Complete!');
		return newStudent;
	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	} finally {
		// Disconnect from the fabric gateway
		console.log('.....Disconnecting from Fabric Gateway');
		contractHelper.disconnect();
	}
}

async function getDrug(drguName, serialNo) {

	try {
		const certnetContract = await contractHelper.getContractInstance();
		// Create a new student account
		console.log('.....Create a new Student account');
		const studentBuffer = await certnetContract.submitTransaction('getDrug', drguName,serialNo);
		// process response
		console.log('.....Processing Create Student Transaction Response \n\n');
		let newStudent = JSON.parse(studentBuffer.toString());
		console.log(newStudent);
		console.log('\n\n.....Create Student Transaction Complete!');
		return newStudent;
	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
	} finally {
		// Disconnect from the fabric gateway
		console.log('.....Disconnecting from Fabric Gateway');
		contractHelper.disconnect();
	}
}
/*
addDrug('200', 'Aakash Bansal', 'connect@aakashbansal.com').then(() => {
	console.log('Student account created');
});
*/
/*getDrug('1','Corex').then(() => {
	console.log('Get Drug is working fine.');
});;*/

module.exports.execute = getDrug;

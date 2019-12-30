'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * Defaults:
 *  User Name: MHRD_ADMIN
 *  User Organization: MHRD
 *  User Role: Admin
 *
 */

const fs = require('fs'); // FileSystem Library
const { FileSystemWallet, X509WalletMixin } = require('fabric-network'); // Wallet Library provided by Fabric
const path = require('path'); // Support library to build filesystem paths in NodeJs

const crypto_materials = path.resolve(__dirname, '../network/crypto-config'); // Directory where all Network artifacts are stored

// A wallet is a filesystem path that stores a collection of Identities

async function generateIdentity(organization, certificatePath, privateKeyPath) {

	// Main try/catch block
	let message = "";
	try {
		let wallet;
		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const certificate = fs.readFileSync(certificatePath).toString();
		// IMPORTANT: Change the private key name to the key generated on your computer
		const privatekey = fs.readFileSync(privateKeyPath).toString();

		let identityLabel;
		let mspId;
		// Load credentials into wallet
		switch (organization.toLowerCase()) {
			case "manufacturer":
				identityLabel = 'MANUFACTURER_ADMIN';
				mspId = 'manufacturerMSP';
				wallet = new FileSystemWallet('./identity/manufacturer');
				break;
			case "distributor":
				identityLabel = 'DISTRIBUTOR_ADMIN';
				mspId = 'distributorMSP';
				wallet = new FileSystemWallet('./identity/distributor');
				break;
			case "retailer":
				identityLabel = 'RETAILER_ADMIN';
				mspId = 'retailerMSP';
				wallet = new FileSystemWallet('./identity/retailer');
				break;
			case "transporter":
				identityLabel = 'TRANSPORTER_ADMIN';
				mspId = 'transporterMSP';
				wallet = new FileSystemWallet('./identity/transporter');
				break;
			case "consumer":
				identityLabel = 'CONSUMER_ADMIN';
				mspId = 'consumerMSP';
				wallet = new FileSystemWallet('./identity/consumer');
				break;
		}
		const identity = X509WalletMixin.createIdentity(mspId, certificate, privatekey);
		await wallet.import(identityLabel, identity);
		message =  "Identity for organization : " + organization + ", added to wallet successfully."
	} catch (error) {
		console.log(`Error while adding identity to wallet for organization : ${organization}. And the Error Message is : ${error}`);
		throw new Error(error);
	}
	return message;
}

async function main(certificatePath, privateKeyPath) {

	// Main try/catch block
	try {
		const wallet = new FileSystemWallet('./identity/manufacturer');
		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const certificate = fs.readFileSync(certificatePath).toString();
		// IMPORTANT: Change the private key name to the key generated on your computer
		const privatekey = fs.readFileSync(privateKeyPath).toString();

		// Load credentials into wallet
		const identityLabel = 'MANUFACTURER_ADMIN';
		const identity = X509WalletMixin.createIdentity('manufacturerMSP', certificate, privatekey);

		await wallet.import(identityLabel, identity);

	} catch (error) {
		console.log(`Error adding to wallet. ${error}`);
		console.log(error.stack);
		throw new Error(error);
	}
}

module.exports.generate = generateIdentity;

/*
generateIdentity('manufacturer','/Users/sathishkumar_su/personal/blockchain/git/drug-counterfeiting_org/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem', '/Users/sathishkumar_su/personal/blockchain/git/drug-counterfeiting_org/network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/029bf1dd541de7d71cc39988e929fb727c40a292ae3acb2113437986cc1c5ff3_sk').then(() => {
	console.log('User identity added to wallet.');
});*/

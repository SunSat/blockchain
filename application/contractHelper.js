const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let manufacturerGateway;



async function getCommonGatewayByOrgRole(organization) {

	switch (organization.toLowerCase()) {
		case "manufacturer":
			return await getManufacturerCommonContractInstance();
			break;
		case "distributor":
			return await getDistributorCommonContractInstance();
			break;
		case "retailer":
			return await getRetailerCommonContractInstance();
			break;
		case "transporter":
			return await getTransporterCommonContractInstance();
			break;
		case "consumer":
			return await getConsumerCommonContractInstance();
			break;
		default :
			break;
	}
}

async function getManufacturerCommonContractInstance() {

	console.log("getManufacturerCommonContractInstance -> Started");
	let commonGateway = new Gateway();

	const wallet = new FileSystemWallet('./identity/manufacturer');

	const fabricUserName = 'MANUFACTURER_ADMIN';

	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	console.log('.....Connecting to Fabric Gateway - in getManufacturerCommonContractInstance');
	await commonGateway.connect(connectionProfile, connectionOptions);

	console.log('.....Connecting to channel - pharmanetworkchannel in getManufacturerCommonContractInstance');
	const channel = await commonGateway.getNetwork('pharmanetworkchannel');

	console.log('.....Connecting to Certnet Smart Contract in getManufacturerCommonContractInstance');
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet');
	let contractObj = {
		commonGateway:commonGateway,
		contract:contract
	};
	return contractObj;
}

async function getDistributorCommonContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let distributorCommonGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/distributor');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'DISTRIBUTOR_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	console.log('.....Connecting to Fabric Gateway - 33333');
	await distributorCommonGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	console.log('.....Connecting to channel - pharmanetworkchannel');
	const channel = await distributorCommonGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	console.log('.....Connecting to Certnet Smart Contract');
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet');
	let contractObj = {
		commonGateway: distributorCommonGateway,
		contract: contract
	}
	return contractObj;
}

async function getRetailerCommonContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let retailerGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/retailer');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'RETAILER_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	await retailerGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	const channel = await retailerGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet');
	let contractObj = {
		commonGateway: retailerGateway,
		contract: contract
	}
	return contractObj;
}

async function getTransporterCommonContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let transporterGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/transporter');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'TRANSPORTER_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	await transporterGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	const channel = await transporterGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet');
	let contractObj = {
		commonGateway: transporterGateway,
		contract: contract
	}
	return contractObj;
}

async function getConsumerCommonContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let consumerGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/consumer');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'CONSUMER_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	await consumerGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	const channel = await consumerGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet');
	let contractObj = {
		commonGateway: consumerGateway,
		contract: contract
	}
	return contractObj;
}

async function getManufacturerContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let manufacturerGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/manufacturer');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'MANUFACTURER_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	console.log('.....Connecting to Fabric Gateway - 1111111');
	await manufacturerGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	console.log('.....Connecting to channel - pharmanetworkchannel');
	const channel = await manufacturerGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	console.log('.....Connecting to Certnet Smart Contract');
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet-manufactureContract');
	let contractObj = {
		commonGateway : manufacturerGateway,
		contract: contract
	}
	return contractObj;
}

async function getDistributorContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let distributorGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/distributor');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'DISTRIBUTOR_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	await distributorGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	console.log('.....Connecting to channel - pharmanetworkchannel');
	const channel = await distributorGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	console.log('.....Connecting to Certnet Smart Contract');
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet-DistributorRetailer');
	let contractObj = {
		commonGateway : distributorGateway,
		contract: contract
	}
	return contractObj;
}

async function getRetailerContractInstance() {

	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-mhrd.yaml
	let retailerGateway = new Gateway();

	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user MHRD_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/retailer');

	// What is the username of this Client user accessing the network?
	const fabricUserName = 'RETAILER_ADMIN';

	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile.yml', 'utf8'));

	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};

	// Connect to gateway using specified parameters
	await retailerGateway.connect(connectionProfile, connectionOptions);

	// Access certification channel
	console.log('.....Connecting to channel - pharmanetworkchannel');
	const channel = await retailerGateway.getNetwork('pharmanetworkchannel');

	// Get instance of deployed Certnet contract
	// @param Name of chaincode
	// @param Name of smart contract
	console.log('.....Connecting to Certnet Smart Contract');
	let contract = await channel.getContract('pharmanet', 'org.pharma-network.pharmanet-DistributorRetailer');
	let contractObj = {
		commonGateway : retailerGateway,
		contract: contract
	}
	return contractObj;
}

module.exports.getCommonGatewayByOrgRole = getCommonGatewayByOrgRole;
module.exports.getManufacturerContractInstance = getManufacturerContractInstance;
module.exports.getDistributorContractInstance = getDistributorContractInstance;
module.exports.getRetailerContractInstance = getRetailerContractInstance;


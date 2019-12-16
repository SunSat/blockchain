'use strict';

const {Contract} = require('fabric-contract-api');
const constants = require('./constantsContract');
const CommonContract = require('./commonContract');
const pharmanetUtil = require('./pharmaNetworkUtil');

class ManufactureContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.pharma-network.com.pharmanetwork.manufactureContract');
	}

	async instantiate(ctx) {
		console.log('The Contract \'org.pharma-network.pharmanet.ManufactureContract\' instrntiate successfully.');
    }

	async registerCompany (ctx, companyCRN, companyName, location, organisationRole) {
		let commonContract = new CommonContract();
		let requestor = ctx.clientIdentity.getID();
		let isValid = pharmanetUtil.checkValidRequestor(requestor,constants.MANUFACTURER_NETWORK);
		console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Register as a new Company.');
			return;
		}

		isValid = pharmanetUtil.checkValidOrganizatioRole(organisationRole);
		console.log("The Provided Organization Role is : "+  organisationRole +" is Valid : " + isValid);
		if(!isValid) {
			throw new Error('The Invalid Company Organization Role.');
			return;
		}

		isValid = await commonContract.isCompanyAvailable(ctx,companyCRN);
		console.log("The requested company is available ? : " + isValid);
		if(isValid) {
			throw new Error('The Company was already registred with same CRN Number : ' + companyCRN);
			return;
		}

		let newCompany  = commonContract.registerCompany(ctx, companyCRN, companyName, location, organisationRole);
		console.log("The new Company was create successfully. " + newCompany);
		return newCompany;

	}

    async addDrug(ctx, drugName, serialNo, mfgData, expDate, companyCRN) {
		let commonContract = new CommonContract();
		let requestor = ctx.clientIdentity.getID();
        let isValid = pharmanetUtil.checkValidRequestor(requestor,constants.MANUFACTURER_NETWORK);
        
        console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Add a new Drug.');
			return;
        }

		isValid = await commonContract.isCompanyAvailable(ctx,companyCRN);
		console.log("The requested company is available ? : " + isValid);
		if(!isValid) {
			throw new Error('There is no such company with the Company CRN : ' + companyCRN);
			return;
		}

		isValid = await commonContract.isDrugAvailable(ctx,serialNo,drugName);
		console.log("The requested Drug is already registered? : " + isValid);
		if(isValid) {
			throw new Error('The drug is already registred : ' + drugName);
			return;
		}


		const drugKey = ctx.stub.createCompositeKey(constants.PHARMANET_KEY_DRUGS,[serialNo,drugName]);
		let newDrug = {
			drugName: drugName,
			serialNo: serialNo,
			mfgData: mfgData,
			expDate : expDate,
			companyCRN : companyCRN,
			createdAt: new Date(),
			modifiedAt: new Date(),
		};

		let newDrugSt = Buffer.from(JSON.stringify(newDrug));
		await ctx.stub.putState(drugKey, newDrugSt);

		return newDrug;
	}
	async getCompany(ctx, companyCRN) {

	}
}

module.exports = ManufactureContract;
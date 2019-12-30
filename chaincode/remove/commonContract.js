'use strict';

const {Contract} = require('fabric-contract-api');
const commonConstants = require('./constantsContract');
const pharmanetUtil = require('../pharmaNetworkUtil');

class CommonContract extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.pharma-network.pharmanet');
	}

	async  instantiate(ctx) {
		console.log('The Contract \'org.pharma-network.pharmanet.commoncontract\' instrntiate successfully.');
	}

	async registerCompany (ctx, companyCrn, companyName, location, organisationRole) {

		let requestor = ctx.clientIdentity.getID();
		let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK) ||
		pharmanetUtil.checkValidRequestor(requestor,commonConstants.DISTRIBUTOR_NETWORK) ||
		pharmanetUtil.checkValidRequestor(requestor,commonConstants.RETAILER_NETWORK) ||
		pharmanetUtil.checkValidRequestor(requestor,commonConstants.TRANSPORTER_NETWORK);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Register as a new Company.');
			return;
		}

		isValid = pharmanetUtil.checkValidOrganizatioRole(organisationRole);
		if(!isValid) {
			throw new Error('The Invalid Company Organization Role.');
			return;
		}
		isValid = await this.isCompanyAvailable(ctx,companyCrn);
		if(isValid) {
			throw new Error('The Company was already registred.');
			return;
		}

		let newCompany = {
			companyCrn: companyCrn,
			companyName: companyName,
			location: location,
			organisationRole : organisationRole,
			createdAt: new Date(),
			modifiedAt: new Date(),
		};

		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_STACKHOLDERS, [companyCrn]);
        let newCompanySt = Buffer.from(JSON.stringify(newCompany));
		await ctx.stub.putState(companyKey, newCompanySt);
		return newCompany;
	}

	async isCompanyAvailable(ctx, companyCrn) {
		let isCompanyAvailable = false;
		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_STACKHOLDERS, [companyCrn]);
		let companyBuffer = await ctx.stub.getState(companyKey).catch(err => console.log(err));
		if(companyBuffer.toString().length > 0) {
			return isCompanyAvailable = true;
		}
		return isCompanyAvailable;

	}
	async getCompany(ctx, companyCrn) {
		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_STACKHOLDERS, [companyCrn]);
		let companyBuffer = await ctx.stub.getState(companyKey).catch(err => console.log(err));
		return JSON.parse(companyBuffer.toString());
	}

	async isDrugAvailable(ctx, serialNo, drugName) {
		let isDrugAvailable = false;
		const drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[serialNo,drugName]);
		let drugBugger = await ctx.stub.getState(drugKey);
		if(drugBugger.toString().length > 0) {
			isDrugAvailable = true;
		}
		return isDrugAvailable;
	}

	async getDrug(ctx, serialNo, drugName) {
		let isDrugAvailable = false;
		const drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[serialNo,drugName]);
		let drugBugger = await ctx.stub.getState(drugKey);
		return JSON.parse(drugBugger.toString());
	}

}
module.exports = CommonContract;
'use strict';

const {Contract} = require('fabric-contract-api');
const ContractPharma = require('./contractPharma');
const pharmanetUtil = require('./pharmaNetworkUtil');
const commonConstants = require('./constants');

class ContractManufacturer extends Contract {

	constructor() {
		super('org.pharma-network.pharmanet-manufactureContract');
	}

	async instantiate(ctx) {
		console.log('The Contract \'org.pharma-network.pharmanet.ManufactureContract\' instrntiate successfully.');
	}

    async addDrug(ctx, drugName, serialNo, mfgData, expDate, companyCrn) {
		let commonContract = new ContractPharma();
		let requestor = ctx.clientIdentity.getID();
        let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);
        
        console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Add a new Drug.');
			return;
        }

		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [companyCrn]);
		isValid = await commonContract.isCompanyAvailable(ctx,companyKey);
		console.log("The requested company is available ? : " + isValid);
		if(!isValid) {
			throw new Error('There is no such company with the Company Crn : ' + companyCrn);
			return;
		}

		//Drug Generated and added to network.
		const drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName,serialNo]);
		isValid = await commonContract.isDrugAvailable(ctx,drugKey);
		console.log("The requested Drug is already registered? : " + isValid);
		if(isValid) {
			throw new Error('The drug is already registred : ' + drugName);
			return;
		}
		
		let newDrug = {
			drugName: drugName,
			serialNo: serialNo,
			mfgData: mfgData,
			expDate : expDate,
			manufacturer : companyCrn,
			owner : companyCrn,
			shipmentKeys : [],
			createdAt: new Date(),
			modifiedAt: new Date(),
		};

		await ctx.stub.putState(drugKey, Buffer.from(JSON.stringify(newDrug)));

		let drugNameVscompanyCrn;
		let company = await commonContract.getRegistredCompany(ctx,companyKey);
		let drugCompanyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS_NAME_VS_COMPANY_NAME,[drugName]);
		isValid = await commonContract.isDrugVsCompanyNameAvailable(ctx,drugCompanyKey);
		console.log("The durg against company name was already registred : " + isValid);
		if(!isValid) {
			drugNameVscompanyCrn = {
				companyCrn : companyCrn,
			};
			console.log("The durg Vs Company Name Stored Successfully : " + JSON.stringify(drugNameVscompanyCrn));
			await ctx.stub.putState(drugCompanyKey, Buffer.from(JSON.stringify(drugNameVscompanyCrn)));
		}

		console.log("---------------The new Drug was Added Successfully ---------------" + JSON.stringify(newDrug));
		return JSON.stringify(newDrug);
	}

	async getDrug(ctx, drugName, serialNo) {
		let commonContract = new ContractPharma();
		let requestor = ctx.clientIdentity.getID();
        let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);

        console.log("The requested requestor value is : "+ requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Add a new Drug.');
			return;
		}

		console.log("The requested Drug serial Number is : " + serialNo + ", & The drugnName: " + drugName);

		const drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName,serialNo]);
		isValid = await commonContract.isDrugAvailable(ctx, drugKey);
		console.log("The requested Drug is already registered? : " + isValid);
		if(!isValid) {
			throw new Error('The drug is not available or registred : ' + drugName);
			return;
		}
		return await commonContract.getRegistredDrug(ctx,drugKey);
	}

	async getCompany(ctx, companyCrn) {
		let commonContract = new ContractPharma();
		let requestor = ctx.clientIdentity.getID();
        let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);
        console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Add a new Drug.');
			return;
		}

		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [companyCrn]);
		isValid = await commonContract.isCompanyAvailable(ctx,companyKey);
		if(!isValid) {
			throw new Error('Invalid Company There is no such Company Available with the company Crn' +companyCrn);
			return;
		}
		return await  commonContract.getRegistredCompany(ctx, companyKey);
	}

}

module.exports = ContractManufacturer;
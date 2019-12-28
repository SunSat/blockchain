'use strict';

const {Contract} = require('fabric-contract-api');
const pharmanetUtil = require('./pharmaNetworkUtil');
const commonConstants = require('./constants');
const ContractPharma = require('./contractPharma');

class ContractDistributorRetailer extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.pharma-network.pharmanet-DistributorRetailer');
		//commonContract = new CommonContract();
	}


	async instantiate(ctx) {
		console.log('The Contract \'org.pharma-network.pharmanet.Retailer\' instrntiate successfully.');
	}
	
	async createPO(ctx, buyerCrn, sellerCrn, drugName, quantity) {

		let commonContract = new ContractPharma();
		let requestor = ctx.clientIdentity.getID();
		let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.DISTRIBUTOR_NETWORK) ||
			pharmanetUtil.checkValidRequestor(requestor,commonConstants.RETAILER_NETWORK) ||
			pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);

		console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to Add a new Drug.');
			return;
		}

		let drugNameKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS_NAME_VS_COMPANY_NAME,[drugName]);
		isValid = await commonContract.isDrugAvailable(ctx,drugNameKey);
		if(!isValid) {
			throw new Error("Invalid Durg Name. There is no such drug is available " + drugName);
			return;
		}

		let buyerCrnKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY,[buyerCrn]);
		isValid = await commonContract.isCompanyAvailable(ctx,buyerCrnKey);
		if(!isValid) {
			throw new Error("There is no such buyer registred. Hence you cannot create this PO. : " + buyerCrn );
			return;
		}

		let sellerCrnKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY,[sellerCrn]);
		isValid = await commonContract.isCompanyAvailable(ctx,sellerCrnKey);
		if(!isValid) {
			throw new Error("There is no such Seller registred. Hence you cannot create this PO. : " + buyerCrn );
			return;
		}

		let buyerCompany = await commonContract.getRegistredCompany(ctx,buyerCrnKey);
		let sellerCompany = await commonContract.getRegistredCompany(ctx,sellerCrnKey);

		isValid = pharmanetUtil.checkPoHierarchy(buyerCompany.organisationRole,sellerCompany.organisationRole);
		if(!isValid) {
			throw new Error("Cannot skip the hierachy. Cannot create PO from Seller OrgRole : "
				+ sellerCompany.organisationRole + " to Buyer OrgRole:" + buyerCompany.organisationRole);
			return;
		}

		if(quantity <= 0) {
			throw  new Error("The quantity should not be less then 0. The requested Quantity is : " + quantity);
			return ;
		}

		console.log("The buyerCrn is : " + buyerCrn + " & The Drugname is : " + drugName);
		let drugPoKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_PO,[buyerCrn,drugName]);
		isValid = await commonContract.isAnyPoAvailable(ctx,drugPoKey);
		if(isValid) {
			throw new Error("The same PO was already. Hence cannot create one more PO. " + JSON.stringify(await commonContract.getPoBycompanyCrn(ctx,drugPoKey)));
			return;
		}

		let newDrugPo = {
			drugName : drugName,
			quantity : quantity,
			buyerCrn : buyerCrn,
			sellerCrn : sellerCrn,
			shipmentKey : "",
			status : "initial"
		};

		await ctx.stub.putState(drugPoKey, Buffer.from(JSON.stringify(newDrugPo)));
		console.log("----The new PO Created Successfully. The PO Object is : ------------ " + JSON.stringify(newDrugPo));
		return newDrugPo;
	}
}

module.exports = ContractDistributorRetailer;
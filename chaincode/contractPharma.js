'use strict';

const {Contract} = require('fabric-contract-api');
const commonConstants = require('./constants');
const pharmanetUtil = require('./pharmaNetworkUtil');
const util = require('util');

class ContractPharma extends Contract {
	
	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.pharma-network.pharmanet');
	}

	async  instantiate(ctx) {
		console.log('The Contract \'org.pharma-network.pharmanet.commoncontract\' instrntiate successfully.');
	}

	async registerCompany(ctx, companyCrn, companyName, location, organisationRole) {
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
			throw new Error('Invalid Company Organization Role.');
			return;
		}

		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [companyCrn]);
		isValid = await this.isCompanyAvailable(ctx,companyKey);
		if(isValid) {
			throw new Error('The Company was already registred. You cannot re-register same company again.' + companyCrn);
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

		console.log(" ---------The New Company Was registred sucessfully. ----------" + JSON.stringify(newCompany));
		return await this.addCompany(ctx, companyKey, newCompany);
    }

	async addCompany (ctx, companyKey, newCompany) {
        let newCompanySt = Buffer.from(JSON.stringify(newCompany));
		await ctx.stub.putState(companyKey, newCompanySt);
		return newCompany;
	}

	async createShipment (ctx, buyerCrn, drugName, listOfAssets, transporterCrn ) {

		let requestor = ctx.clientIdentity.getID();
		let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.DISTRIBUTOR_NETWORK) ||
			pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);

		console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to shift a product.');
			return;
		}

/*
		console.info('Transaction ID: ' + ctx.stub.getTxID());
		console.info(util.format('Args: %j', ctx.stub.getArgs()));
*/

		const buyerKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [buyerCrn]);
		isValid = await this.isCompanyAvailable(ctx,buyerKey);
		console.log("The buyer company is available ? : " + isValid);

		if(!isValid) {
			throw new Error('There is no such buyer company with the buyer Crn : ' + buyerCrn);
			return;
		}

		const transporterKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [transporterCrn]);
		isValid = await this.isCompanyAvailable(ctx,transporterKey);
		console.log("The Transporter company is available ? : " + isValid);
		if(!isValid) {
			throw new Error('There is no such Transporter company registred with the Crn : ' + transporterCrn);
			return;
		}

		let drugCompanyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS_NAME_VS_COMPANY_NAME,[drugName]);
		isValid = await this.isDrugAvailable(ctx,drugCompanyKey);
		console.log("The Drug is successfully registered : " + isValid);
		if(!isValid) {
			console.log("There is no Such drug Or Company available. : " + drugName);
			return;
		}

		//let drugNameVsCompanyCrnObj = await this.getRegistredDrug(ctx, drugCompanyKey);
		//let sellerCrn = drugNameVsCompanyCrnObj.companyCrn;

		//let sellerCompanyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY,[sellerCrn]);
		//let sellerCompany = await this.getRegistredCompany(ctx, sellerCompanyKey);

		let drugPoKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_PO,[buyerCrn,drugName]);
		isValid = await this.isAnyPoAvailable(ctx,drugPoKey);
		console.log("is the PO available? : " + isValid + " . For the Key " + JSON.stringify(drugPoKey));
		if(!isValid) {
			throw new Error("The is no such PO available with respect to buyerCrn " + buyerCrn + " & The Drug name : " + drugName);
			return;
		}

		let po = await this.getPoBycompanyCrn(ctx,drugPoKey);
		console.log("The PO Object is : " + JSON.stringify(po));

		const listOfDrugGoingToSell = [];
		const listOfDrugKey = [];
		const listOfAssetObj = listOfAssets.split(",");
		for(const asset of listOfAssetObj) {
			let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName,asset]);
			if(!await this.isDrugAvailable(ctx,drugKey)) {
				throw new Error("The Requested Drug is not available. The Drug Name is : " +drugName);
				return;
			}
			let drugObject = await this.getRegistredDrug(ctx,drugKey);
			console.log("The Durg is : " + JSON.stringify(drugObject));

			if(drugObject.owner != po.sellerCrn) {
				throw new Error("The Requested Drug owner is not the seller. Hence Your not authorized to shift this product. Durg Serial number is : " + asset);
				return;
			}
			listOfDrugGoingToSell.push(drugObject);
			listOfDrugKey.push([drugName,asset]);
		}

		console.log("The Drug details are : " + JSON.stringify(listOfDrugGoingToSell));
		console.log("The Drug details are : " + JSON.stringify(listOfDrugKey));

		if(listOfDrugGoingToSell.length != po.quantity) {
			throw new Error("The PO quantity is not met. The required drug is not available. " + listOfDrugGoingToSell.length + " THe PO quantity is : " + po.quantity);
			return;
		}

		let shipmentObject = {
			creator : po.sellerCrn,
			assets: listOfDrugKey,
			transporter: transporterCrn,
			status: "in-transit",
			shipTo : po.buyerCrn
		};

		let shipmentKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_SHIPMENT,[buyerCrn,drugName]);
		isValid = await this.isAnyShipmentAvailable(ctx,shipmentKey);
		console.log("The existing shipment object is : " + JSON.stringify( await ctx.stub.getState(shipmentKey)).toString());
		if(isValid) {
			throw new Error("The same shipment already available. Hence you cannot add one more.");
			return;
		}

		for(const drugObj of listOfDrugGoingToSell) {
			let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugObj.drugName,drugObj.serialNo]);
			drugObj.owner = transporterCrn;
			//drugObj.shipmentKeys.push(shipmentKey);
			console.log("The Drug State has been updated successfully And the Drug Obj is : " + JSON.stringify(drugObj));
			await ctx.stub.putState(drugKey, Buffer.from(JSON.stringify(drugObj)));
		}

		po.shipmentKey = shipmentKey;
		po.status = "completed";

		await ctx.stub.putState(drugPoKey, Buffer.from(JSON.stringify(po)));
		console.log("The PO object updated successfully. And the Object is : " + JSON.stringify(po));

		await ctx.stub.putState(shipmentKey,Buffer.from(JSON.stringify(shipmentObject)));
		console.log("------The Shipment Object create successfully. And the Shipment Object is :------ " + JSON.stringify(shipmentObject));
		return shipmentObject;

		/*let partialIterator = await ctx.stub.getStateByPartialCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName]);
		const allResults = [];
		let count = 0;
		let poCount = parseInt(po.quantity);
		while (true) {
			const res = await partialIterator.next();
			if (res.value) {
				let drugObj = JSON.parse(res.value.value.toString('utf8'));
			}
			if (res.done) {
				// explicitly close the iterator
				await partialIterator.close();
				break;
			}
		}*/

	}

	async updateShipment(ctx, buyerCrn, drugName, transporterCrn) {

		let requestor = ctx.clientIdentity.getID();
		let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.DISTRIBUTOR_NETWORK) ||
			pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);

		console.log("The requested requestor value is : ", requestor + ", & The Requestor is Valid : " + isValid);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to shift a product.');
			return;
		}

		/*
           console.info('Transaction ID: ' + ctx.stub.getTxID());
           console.info(util.format('Args: %j', ctx.stub.getArgs()));
        */

		const buyerKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [buyerCrn]);
		isValid = await this.isCompanyAvailable(ctx,buyerKey);
		console.log("The buyer company is available ? : " + isValid);
		if(!isValid) {
			throw new Error('There is no such buyer company with the buyer Crn : ' + buyerCrn);
			return;
		}

		const transporterKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [transporterCrn]);
		isValid = await this.isCompanyAvailable(ctx,transporterKey);
		console.log("The Transporter company is available ? : " + isValid);
		if(!isValid) {
			throw new Error('There is no such Transporter company registred with the Crn : ' + transporterCrn);
			return;
		}

		let shipmentKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_SHIPMENT,[buyerCrn,drugName]);
		isValid = await this.isAnyShipmentAvailable(ctx,shipmentKey);
		console.log("Shipment is available ? " + isValid);
		if(!isValid) {
			throw new Error("Their is no such shipment already available. Hence you Update.");
			return;
		}

		var shipmentObj = await this.getShipmentByKey(ctx,shipmentKey);
		var listOfDrugs = shipmentObj.assets;
		const listOfDrugGoingToSell = [];
		for(const drugArray of listOfDrugs) {
			console.log("The Drug I am going to get is : " + drugArray);
			let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugArray[0],drugArray[1]]);
			if(!await this.isDrugAvailable(ctx,drugKey)) {
				throw new Error("The Requested Drug is not available. The Drug Name is : " +drugName);
				return;
			}
			let drugObject = await this.getRegistredDrug(ctx,drugKey);
			if(drugObject.owner != transporterCrn) {
				throw new Error("The Requested Drug owner is not the transporterCrn. Hence Your not authorized to shift this product. Durg Serial number is : " + drugKey[1]);
				return;
			}
			listOfDrugGoingToSell.push(drugObject);
		}

		for(const drugObj of listOfDrugGoingToSell) {
			let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugObj.drugName,drugObj.serialNo]);
			drugObj.owner = buyerCrn;
			drugObj.shipmentKeys.push(shipmentKey);
			console.log("The Drug State has been updated successfully And the Drug Obj is : " + JSON.stringify(drugObj));
			await ctx.stub.putState(drugKey, Buffer.from(JSON.stringify(drugObj)));
		}
		shipmentObj.status = "delivered";
		await ctx.stub.putState(shipmentKey,Buffer.from(JSON.stringify(shipmentObj)));
		console.log("---------The Shipment was completed successfully. Status updated.--------: " + JSON.stringify(shipmentObj));
		return shipmentObj;

	}


	async retailDrug (ctx, drugName, serialNo, retailerCrn, customerAadhar) {

		let requestor = ctx.clientIdentity.getID();
		let isValid = pharmanetUtil.checkValidRequestor(requestor,commonConstants.RETAILER_NETWORK) ||
			pharmanetUtil.checkValidRequestor(requestor,commonConstants.MANUFACTURER_NETWORK);
		if(!isValid) {
			throw new Error('Invalid Requestor. Your are not authrozied to retail this drug as a new Company.');
			return;
		}

		const retailerKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [retailerCrn]);
		isValid = await this.isCompanyAvailable(ctx,retailerKey);
		console.log("The retailer is available ? : " + isValid);

		if(!isValid) {
			throw new Error('There is no such retailer company with the buyer Crn : ' + retailerCrn);
			return;
		}

		let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName,serialNo]);
		if(!await this.isDrugAvailable(ctx,drugKey)) {
			throw new Error("The Requested Drug is not available. The Drug Name is : " +drugName);
			return;
		}
		let drugObject = await this.getRegistredDrug(ctx,drugKey);
		if(drugObject.owner != retailerCrn) {
			throw new Error("The Requested Drug owner is not the seller. Hence Your not authorized to shift this product. Durg Serial number is : " + drugObject.serialNo);
			return;
		}

		drugObject.owner = customerAadhar;

		await ctx.stub.putState(drugKey, Buffer.from(JSON.stringify(drugObject)));
		console.log("------The Durg Object update successfully. And the Object is :---- " + JSON.stringify(drugObject));
		return drugObject;

	}

	async viewHistory(ctx, drugName, serialNo) {
		let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName,serialNo]);
		let isValid = await this.isDrugAvailable(ctx,drugKey);
		if(!isValid) {
			throw new Error("The Requested Drug is not available. The Drug Name is : " +drugName);
			return;
		}

		let drugObject = await this.getRegistredDrug(ctx,drugKey);

		const manufacturerKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [drugObject.manufacturer]);
		isValid = await this.isCompanyAvailable(ctx,manufacturerKey);
		console.log("The Manufacturer company is available ? : " + isValid);
		if(!isValid) {
			throw new Error('There is no such buyer company with the buyer Crn : ' + drugObject.manufacturer);
			return;
		}
		let manufacturerObj = await this.getRegistredCompany(ctx,manufacturerKey);

		const ownerKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [drugObject.owner]);
		let ownerObj = "";
		isValid = await this.isCompanyAvailable(ctx,ownerKey);
		console.log("The Owner company is available ? : " + isValid);
		if(isValid) {
			ownerObj = await this.getRegistredCompany(ctx,ownerKey);
		} else {
			ownerObj = drugObject.owner;
		}


		let shipmentArr = [];
		console.log("The shipment Keys are : " + drugObject.shipmentKeys);

		if( drugObject.shipmentKeys && drugObject.shipmentKeys.length > 0) {
			for(const shipmentKeySt of drugObject.shipmentKeys) {
				let splitObj = ctx.stub.splitCompositeKey(shipmentKeySt);
				let shipmentKey =  ctx.stub.createCompositeKey(splitObj.objectType, splitObj.attributes);
				isValid = await this.isAnyStateAvailable(ctx,shipmentKey);
				if(!isValid) {
					throw new Error("There is no shpment Key error. Contact Adminstrator");
					return;
				}
				shipmentArr.push(await this.getStateObject(ctx,shipmentKey));
			}
		}

		let finalResult = {
			drugName: drugObject.drugName,
			serialNo: drugObject.serialNo,
			mfgData: drugObject.mfgData,
			expDate: drugObject.expDate,
			manufacturer: manufacturerObj,
			owner: ownerObj,
			shipmentObj: shipmentArr,
			createdAt: drugObject.createdAt,
			modifiedAt: drugObject.modifiedAt
		}

		console.log("The final result going to return is : " + JSON.stringify(finalResult));

		return finalResult;
	}

	async viewDrugCurrentState(ctx, drugName, serialNo) {
		let drugKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_DRUGS,[drugName,serialNo]);
		let isValid = await this.isDrugAvailable(ctx,drugKey);
		if(!isValid) {
			throw new Error("The Requested Drug is not available. The Drug Name is : " +drugName);
			return;
		}

		let drugObject = await this.getRegistredDrug(ctx,drugKey);

		const ownerKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY, [drugObject.owner]);
		isValid = await this.isCompanyAvailable(ctx,ownerKey);
		let ownerObj= "";
		let currentSt = "The Drug is currently with ";
		console.log("The Owner company is available ? : " + isValid);
		if(isValid) {
			ownerObj = await this.getRegistredCompany(ctx,ownerKey);
		} else {
			ownerObj = drugObject.owner;
		}

		switch (ownerObj.organisationRole) {
			case commonConstants.MANUFACTURER:
				currentSt += commonConstants.MANUFACTURER;
				break;
			case commonConstants.DISTRIBUTOR:
				currentSt += commonConstants.DISTRIBUTOR;
				break;
			case commonConstants.RETAILER:
				currentSt += commonConstants.RETAILER;
				break;
			case commonConstants.TRANSPORTER:
				currentSt += commonConstants.TRANSPORTER;
				break;
			case commonConstants.CONSUMER:
			default:
				currentSt += commonConstants.CONSUMER;
				break;
		}

		let finalResult = {
			drugName: drugObject.drugName,
			serialNo : drugObject.serialNo,
			CurrentState : currentSt,
			detail: ownerObj,
		}
		console.log("The final result going to return is : " + JSON.stringify(finalResult));
		return finalResult;
	}


	async getAllPoList(ctx, companyCrn) {
		console.log("The getAllPoList" + companyCrn);
		const companyKey = ctx.stub.createCompositeKey(commonConstants.PHARMANET_KEY_COMPANY_NAME_VS_PO, [companyCrn]);
		let poList;
		if(await this.isAnyPoAvailable(ctx, companyKey)) {
			poList = await this.getPoBycompanyCrn(ctx, companyKey);
		} else {
			poList = {}
		}
		console.log("The POList is : " + poList);
		return poList;
	}

	async isCompanyAvailable(ctx, companyKey) {
		let isCompanyAvailable = false;
		let companyBuffer = await ctx.stub.getState(companyKey).catch(err => console.log(err));
		if(companyBuffer.toString().length > 0) {
			return isCompanyAvailable = true;
		}
		return isCompanyAvailable;

	}

	async getRegistredCompany(ctx, companyKey) {
		let companyBuffer = await ctx.stub.getState(companyKey).catch(err => console.log(err));
		return JSON.parse(companyBuffer.toString());
	}

	async isDrugAvailable(ctx, drugKey) {
		let isDrugAvailable = false;
		let drugBuffer = await ctx.stub.getState(drugKey);
		if(drugBuffer.toString().length > 0) {
			isDrugAvailable = true;
		}
		return isDrugAvailable;
	}

	async isDrugVsCompanyNameAvailable(ctx, drugKey) {
		let isDrugVsCompanyNameAvailable = false;
		let drugBuffer = await ctx.stub.getState(drugKey);
		if(drugBuffer.toString().length > 0) {
			isDrugVsCompanyNameAvailable = true;
		}
		return isDrugVsCompanyNameAvailable;
	}


	async getRegistredDrug(ctx, drugKey) {
		let drugBuffer = await ctx.stub.getState(drugKey);
		return JSON.parse(drugBuffer.toString());
	}

	async isAnyPoAvailable(ctx, companyKey) {
		let companyPoBuffer = await ctx.stub.getState(companyKey);
		if(companyPoBuffer.toString().length > 0) {
			return true;
		}
		return false;
	}

	async getPoBycompanyCrn(ctx, drugPoKey) {
		let companyPoBuffer = await ctx.stub.getState(drugPoKey);
		return JSON.parse(companyPoBuffer.toString())
	}

	async isAnyShipmentAvailable(ctx, companyKey) {
		let companyPoBuffer = await ctx.stub.getState(companyKey);
		if(companyPoBuffer.toString().length > 0) {
			return true;
		}
		return false;
	}

	async getShipmentByKey(ctx, drugPoKey) {
		let companyPoBuffer = await ctx.stub.getState(drugPoKey);
		return JSON.parse(companyPoBuffer.toString())
	}

	async isAnyStateAvailable(ctx, statePoKey) {
		let buffer = await ctx.stub.getState(statePoKey);
		if(buffer.toString().length > 0) {
			return true;
		}
		return false;
	}

	async getStateObject(ctx, statePoKey) {
		let buffer = await ctx.stub.getState(statePoKey);
		return JSON.parse(buffer.toString())
	}

}
module.exports = ContractPharma;
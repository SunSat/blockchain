const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Import all function modules
const addToWallet = require('./generateIdentity');

const manufacturerContract = require('./manufacture');
const commonContract = require('./common');
const contractHelper = require('./contractHelper');
const distributorRetailer = require('./distributorRetailer');
//const issueCertificate = require('./4_issueCertificate');
//const verifyCertificate = require('./5_verifyCertificate');
// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing hello/json
app.use(express.urlencoded({ extended: true })); // for parsing hello/x-www-form-urlencoded
app.set('title', 'Pharma Network App');

app.get('/', (req, res) => res.send('Hello World Pharma Network.'));

app.post('/addToWallet', (req, res) => {
	addToWallet.generate(req.body.organization, req.body.certificatePath, req.body.privateKeyPath)
		.then((message) => {
			const result = {
				status: 'success',
				message: message
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/registerCompany', (req, res) => {
	console.log("Inside registerCompany Controller. ");
	commonContract.registerCompany(req.body.companyCrn, req.body.companyName, req.body.location, req.body.organisationRole)
		.then((responseObj) => {
			const result = {
				status: 'success',
				message: 'The New Company has been Registered Successfully.',
				drug: responseObj
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/addDrug', (req, res) => {
	manufacturerContract.addDrug(req.body.drugName, req.body.serialNo,req.body.mfgDate,req.body.expDate,req.body.companyCrn)
		.then((drguObj) => {
			const result = {
				status: 'success',
				message: 'The New Drug Successfully Added. The new drug details are : ',
				drug: drguObj
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/createPO', (req, res) => {
	distributorRetailer.createPo(req.body.organizationRole, req.body.buyerCrn, req.body.sellerCrn, req.body.drugName, req.body.quantity)
		.then((createPoObj) => {
			const result = {
				status: 'success',
				message: 'The New PO created successfully. The new PO Details is : ',
				po: createPoObj
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/createShipment', (req, res) => {
	commonContract.createShipment(req.body.organizationRole, req.body.buyerCrn, req.body.drugName, req.body.listOfAssets, req.body.transporterCrn)
		.then((shipment) => {
			const result = {
				status: 'success',
				message: 'New shipment created successfully. The shipment Details are : ',
				shipment: shipment
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/updateShipment', (req, res) => {
	commonContract.updateShipment(req.body.organizationRole, req.body.buyerCrn, req.body.drugName, req.body.transporterCrn)
		.then((shipment) => {
			const result = {
				status: 'success',
				message: 'The Drug delivered successfully. The shipment updates Details are : ',
				shipment: shipment
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/retailDrug', (req, res) => {
	commonContract.retailDrug(req.body.organizationRole, req.body.drugName, req.body.serialNo, req.body.retailerCrn, req.body.customerAadhar)
		.then((shipment) => {
			const result = {
				status: 'success',
				message: 'The Drug Retailed successfully. The Retail Details are : ',
				shipment: shipment
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/viewHistory', (req, res) => {
	commonContract.viewHistory(req.body.organizationRole, req.body.drugName, req.body.serialNo)
		.then((viewHistory) => {
			const result = {
				status: 'success',
				message: 'The Full History of Drug is : ',
				shipment: viewHistory
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.post('/viewDrugCurrentState', (req, res) => {
	commonContract.viewDrugCurrentState(req.body.organizationRole, req.body.drugName, req.body.serialNo)
		.then((viewHistory) => {
			const result = {
				status: 'success',
				message: 'The Current State of the Drug is : ',
				shipment: viewHistory
			};
			res.json(result);
		})
		.catch((e) => {
			const result = {
				status: 'error',
				message: 'Failed',
				error: e
			};
			res.status(500).send(result);
		});
});

app.listen(port, () => console.log(`Distributed Pharma Network App listening on port ${port}!`));
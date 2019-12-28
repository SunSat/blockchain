

Data Structures :
1. Key : org.pharma-network.pharmanet.company, [companyCrn]
   Company = {
			companyCrn: companyCrn,
			companyName: companyName,
			location: location,
			organisationRole : organisationRole,
			createdAt: new Date(),
			modifiedAt: new Date(),
		};
2. Key : org.pharma-network.pharmanet.drug, [drugname, serialNo]
   newDrug = {
   			drugName: drugName,
   			serialNo: serialNo,
   			mfgData: mfgData,
   			expDate : expDate,
   			companyCrn : companyCrn,
   			owner : commonConstants.MANUFACTURER,
   			shipmentKeys : [],
   			createdAt: new Date(),
   			modifiedAt: new Date(),
   		};
3. Key : org.pharma-network.pharmanet.po, [buyerCrn,drugName]
    newDrugPo = {
    	drugName : drugName,
    	quantity : quantity,
    	buyerCrn : buyerCrn,
    	sellerCrn : sellerCrn,
    	status : "initial"
    }
4. Key : org.pharma-network.pharmanet.drug.name.vs.companyname, [drugName]
   drugNameVscompanyCrn = {
			companyCrn : companyCrn,
		};
5. Key : org.pharma-network.pharmanet.drug.available.serialno, [drugName]
    drugAilableObj = {
			serialNo : [serialNo1,serialNo2,serialNo3...]
		}
6. Key : org.pharma-network.pharmanet.po, [sellerCrn]
        sellerPoObj = {
			buyerCrn : buyerCrn,
			drugName : drugName
		}
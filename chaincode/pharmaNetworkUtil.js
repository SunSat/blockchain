'use strict';
const Constants = require('./constants');

class PharmaNetworkUtil {

    static checkValidRequestor(requestor, requestorOrg) {
        if(requestor.includes(requestorOrg)) {
            return true;
        } else {
            return false;
        }
    }
    
    static checkValidOrganizatioRole(organisationRole) {
        let isValid = false;
        switch (organisationRole.toLowerCase()) {
            case Constants.TRANSPORTER:
                    isValid =  true;
            break;
            case Constants.DISTRIBUTOR:
                    isValid =  true;
            break;
            case Constants.RETAILER:
                    isValid =  true;
            break;
            case Constants.CONSUMER:
                    isValid =  true;
            break;
            case Constants.MANUFACTURER:
                    isValid = true;
            break;
        }
        return isValid;
    }

    static checkPoHierarchy(buyerOrgRole, sellerOrgRole) {
        if(buyerOrgRole.toLowerCase() === Constants.DISTRIBUTOR) {
            return sellerOrgRole.toLowerCase() === Constants.MANUFACTURER;
        } else if(buyerOrgRole.toLowerCase() === Constants.RETAILER) {
            return sellerOrgRole.toLowerCase() === Constants.DISTRIBUTOR;
        }
        return false;
    }
}

module.exports = PharmaNetworkUtil;

'use strict';
const Constants = require('./constantsContract');

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
}

module.exports = PharmaNetworkUtil;

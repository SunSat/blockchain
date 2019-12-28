'use strict';

const contractPharma = require('./contractPharma');
const contractManufacturer = require('./contractManufacturer');
const contractDistributorRetailer = require('./contractDistributorRetailer');

module.exports.contractPharma = contractPharma;
module.exports.contractManufacturer = contractManufacturer;
module.exports.contractDistributorRetailer = contractDistributorRetailer;

module.exports.contracts = [contractPharma,contractManufacturer,contractDistributorRetailer];

#!/bin/bash

echo
echo " ____    _____      _      ____    _____ "
echo "/ ___|  |_   _|    / \    |  _ \  |_   _|"
echo "\___ \    | |     / _ \   | |_) |   | |  "
echo " ___) |   | |    / ___ \  |  _ <    | |  "
echo "|____/    |_|   /_/   \_\ |_| \_\   |_|  "
echo
echo "Deploying Chaincode CERTNET On Certification Network"
echo

echo "------Registrator Company Started.-----"

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","MAN001","Sun Pharma","Chennai","manufacturer"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","MAN002","Sun Pharma Net","Tirupattur","manufacturer"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","TRA001","FedEx","Delhi","transporter"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","TRA002","Blue Dart","Bangalore","transporter"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","DIST001","VG Pharma","Vizag","distributor"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","DIST002","Sat VSAS","Tirupattur","distributor"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","RET001","upgrad","Mumbai","retailer"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:registerCompany","RET002","Sathish","Tirupattur","retailer"]}'

echo "-----Registrator Company Ends-----------"

echo "-----addDrug Company Start-----------"

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-manufactureContract:addDrug","paracetamol00004","0001","11-11-19","11-11-19","MAN002"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-manufactureContract:addDrug","paracetamol00004","0002","11-11-19","11-11-19","MAN001"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-manufactureContract:addDrug","paracetamol00004","0003","11-11-19","11-11-19","MAN001"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-manufactureContract:addDrug","paracetamol00004","0004","11-11-19","11-11-19","MAN001"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-manufactureContract:addDrug","paracetamol00004","0005","11-11-19","11-11-19","MAN001"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-manufactureContract:addDrug","paracetamol00004","0006","11-11-19","11-11-19","MAN002"]}'


echo "-----addDrug Company Ends-----------"

echo "-----Creare PO Company Start-----------"

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-DistributorRetailer:createPO","RET002","DIST002","paracetamol00004","2"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet-DistributorRetailer:createPO","DIST002","MAN002","paracetamol00004","2"]}'


echo "-----Creare PO Company Ends-----------"

echo "-----Create Shipment Company Start-----------"

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:createShipment","DIST002","paracetamol00004","0001,0006","TRA002"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:createShipment","RET002","paracetamol00004","0001,0006","TRA001"]}'


echo "-----Create Shipment Company Ends-----------"

echo "-----Update Shipment Company Start-----------"

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:updateShipment","DIST002","paracetamol00004","TRA002"]}'

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:updateShipment","RET002","paracetamol00004","TRA001"]}'

echo "-----Update Shipment Company Ends-----------"

echo "-----Retail Durg Company Start-----------"

peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:retailDrug","paracetamol00004","0001","RET002","sat111"]}'
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmanetworkchannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet:retailDrug","paracetamol00004","0002","RET002","sat111"]}'

echo "-----Retail Durg Company Ends-----------"

echo
echo "========= All GOOD, Chaincode CERTNET Is Now Installed & Instantiated On Certification Network =========== "
echo

echo
echo " _____   _   _   ____   "
echo "| ____| | \ | | |  _ \  "
echo "|  _|   |  \| | | | | | "
echo "| |___  | |\  | | |_| | "
echo "|_____| |_| \_| |____/  "
echo

exit 0

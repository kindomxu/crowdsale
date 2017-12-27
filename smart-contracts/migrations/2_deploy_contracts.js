var FairToken = artifacts.require("./FairToken.sol");
var FairGameCrowdSale = artifacts.require("./FairGameCrowdSale.sol");


module.exports = function(deployer, network, accounts) {

    var beneficiaryAddr = accounts[0];
    var tokenHolderAddr = accounts[0];
    if(network === "live"){
        beneficiaryAddr = "0x587EFdCE16C9a1a4bBa436C6a5197658C468179e";
    }

    deployer.deploy(FairToken).then(function () {
        return deployer.deploy(FairGameCrowdSale, beneficiaryAddr, tokenHolderAddr, FairToken.address);
    });


};

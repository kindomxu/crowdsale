var FairToken = artifacts.require("./FairToken.sol");
var FairGameCrowdSale = artifacts.require("./FairGameCrowdSale.sol");


module.exports = function(deployer, network, accounts) {

    var beneficiaryAddr = accounts[0];
    var tokenHolderAddr = accounts[0];

    deployer.deploy(FairToken).then(function () {
        return deployer.deploy(FairGameCrowdSale, beneficiaryAddr, tokenHolderAddr, FairToken.address);
    });


};

var FairToken = artifacts.require("./FairToken.sol");


module.exports = function(callback) {
    var token = null;

    var targetAddr = "0x54477bb131A51224252a9E06e4FCcAEBdA695233";
    var value = "10000000000000000000";

    return FairToken.deployed().then(function (instance) {
        token = instance;
        console.log("FairToken Address:", token.address);
    }).then(function () {

        return token.balanceOf(targetAddr);
    }).then(function (balance) {
        console.log('Target Balance:', balance.toNumber());
    }).then(function () {

        return token.transfer(targetAddr, value);
    }).then(function () {

        return token.balanceOf(targetAddr);
    }).then(function (balance) {
        console.log('Target Balance:', balance.toNumber());
    }).then(function () {


    });
};

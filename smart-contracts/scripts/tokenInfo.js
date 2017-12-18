var FairToken = artifacts.require("./FairToken.sol");


module.exports = function(callback) {
    var token = null;

    return FairToken.deployed().then(function (instance) {
        token = instance;
        console.log("FairToken Address:", token.address);
    }).then(function () {

        return token.name.call();
    }).then(function (name) {
        console.log('name:', name);
    }).then(function () {

        return token.symbol();
    }).then(function (symbol) {
        console.log('symbol:', symbol);
    }).then(function () {

        return token.decimals();
    }).then(function (decimals) {
        console.log('decimals:', decimals.toNumber());
    }).then(function () {

        return token.totalSupply();
    }).then(function (totalSupply) {
        console.log('totalSupply:', totalSupply.toNumber());
    }).then(function () {


    });
};

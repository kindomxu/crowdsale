var FairToken = artifacts.require("./FairToken.sol");

contract('FairToken', function (accounts) {
    var account1 = accounts[0];
    var account2 = accounts[1];
    var account3 = accounts[2];
    var token;

    it("Init", function () {
        return FairToken.deployed().then(function (instance) {
            token = instance;

        });
    });


    it("Balance", function () {
        var balance1;
        var balance2;
        var tokenValue = "10000000000000000000";    // 10 FAIR

        var totalSupply;

        return token.totalSupply().then(function (amount) {
            totalSupply = amount;
        }).then(function () {

            // Get Account1 Balance
            return token.balanceOf(account1);
        }).then(function (balance) {
            balance1 = balance;
            assert.equal(web3.fromWei(balance1.toNumber(), "ether"), "1200000000", "Init balance incorrect");
        }).then(function () {

            // Get Account2 Balance
            return token.balanceOf(account2);
        }).then(function (balance) {
            balance2 = balance;
            assert.equal(balance2.toNumber(), 0, "Init balance incorrect");
        }).then(function () {

            // transfer 1 to 2 with 10 FAIR
            return token.transfer(account2, tokenValue);
        }).then(function () {

            // Check Account1 Balance
            return token.balanceOf(account1);
        }).then(function (balance) {
            assert.equal(balance1.minus(tokenValue).toString(), balance.toString(), "balance incorrect after transfer");
            balance1 = balance;
        }).then(function () {

            // Check Account2 Balance
            return token.balanceOf(account2);
        }).then(function (balance) {
            assert.equal(balance2.plus(tokenValue).toString(), balance.toString(), "balance incorrect after transfer");
            balance2 = balance;
        }).then(function () {

            // Check totalSupply
            return token.totalSupply();
        }).then(function (amount) {
            assert.equal(totalSupply.toString(), amount.toString(), "totalSupply should NOT be changed after transfer");
        }).then(function () {

            // Burn Account2's tokens
            return token.burn(tokenValue, {from: account2});
        }).then(function () {

            // Check Account2 Balance is 0
            return token.balanceOf(account2);
        }).then(function (balance) {
            assert.equal(0, balance.toNumber(), "Balance incorrect after burn");
            balance2 = balance;
        }).then(function () {

            // Check totalSupply
            return token.totalSupply();
        }).then(function (amount) {
            assert.equal(totalSupply.minus(tokenValue).toString(), amount.toString(), "totalSupply incorrect after burn");
            totalSupply = amount;
        }).then(function () {


        });
    });


    it("Allowance", function () {

        var tokenValue = "10000000000000000000";    // 10 FAIR

        var totalSupply;

        var allowance1to3;

        var balance1;
        var balance2;
        var balance3;


        return token.totalSupply().then(function (amount) {
            totalSupply = amount;
        }).then(function () {

            // Get Account1 Balance
            return token.balanceOf(account1);
        }).then(function (balance) {
            balance1 = balance;
        }).then(function () {

            // Get Account2 Balance
            return token.balanceOf(account2);
        }).then(function (balance) {
            balance2 = balance;
        }).then(function () {

            // Get Account3 Balance
            return token.balanceOf(account3);
        }).then(function (balance) {
            balance3 = balance;
        }).then(function () {

            // Init Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toNumber(), 0, "Init allowance should be 0");
            allowance1to3 = allowance;
        }).then(function () {

            // ----Start Approve---
            return token.approve(account3, tokenValue, {from: account1});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toString(), tokenValue, "allowance incorrect after approve");
            allowance1to3 = allowance;
        }).then(function () {

            // Check Account3 Balance
            return token.balanceOf(account3);
        }).then(function (balance) {
            assert.equal(balance3.toString(), balance.toString(), "balance incorrect after approve");
        }).then(function () {

            // ---Start Increase Allowance---
            return token.increaseApproval(account3, tokenValue, {from: account1});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toString(), allowance1to3.plus(tokenValue).toString(), "allowance incorrect after approve");
            allowance1to3 = allowance;
        }).then(function () {

            // ---Start Increase Allowance----
            return token.increaseApproval(account3, tokenValue, {from: account1});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toString(), allowance1to3.plus(tokenValue).toString(), "allowance incorrect after approve");
            allowance1to3 = allowance;
        }).then(function () {

            // Start Decrease Allowance
            return token.decreaseApproval(account3, tokenValue, {from: account1});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toString(), allowance1to3.minus(tokenValue).toString(), "allowance incorrect after approve");
            allowance1to3 = allowance;
        }).then(function () {

            // ----transferFrom account1 to account2 via account3----
            return token.transferFrom(account1, account2, tokenValue, {from: account3});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toString(), allowance1to3.minus(tokenValue).toString(), "allowance incorrect after transferFrom");
            allowance1to3 = allowance;
        }).then(function () {

            // Check Account1 Balance
            return token.balanceOf(account1);
        }).then(function (balance) {
            assert.equal(balance.toString(), balance1.minus(tokenValue).toString(), "balance incorrect after transferFrom");
            balance1 = balance;
        }).then(function () {

            // Check Account2 Balance
            return token.balanceOf(account2);
        }).then(function (balance) {
            assert.equal(balance.toString(), balance2.plus(tokenValue).toString(), "balance incorrect after transferFrom");
            balance2 = balance;
        }).then(function () {

            // Get Account3 Balance
            return token.balanceOf(account3);
        }).then(function (balance) {
            assert.equal(balance.toString(), balance3.toString(), "balance incorrect after transferFrom");
            balance3 = balance;
        }).then(function () {

            // ---Start burnFrom account1 via account3---
            return token.burnFrom(account1, tokenValue, {from: account3});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, account3);
        }).then(function (allowance) {
            assert.equal(allowance.toString(), allowance1to3.minus(tokenValue).toString(), "allowance incorrect after transferFrom");
            allowance1to3 = allowance;
        }).then(function () {

            // Check Account1 Balance
            return token.balanceOf(account1);
        }).then(function (balance) {
            assert.equal(balance.toString(), balance1.minus(tokenValue).toString(), "balance incorrect after transferFrom");
            balance1 = balance;
        }).then(function () {

            // Check Account2 Balance
            return token.balanceOf(account2);
        }).then(function (balance) {
            assert.equal(balance.toString(), balance2.toString(), "balance incorrect after transferFrom");
            balance2 = balance;
        }).then(function () {

            // Get Account3 Balance
            return token.balanceOf(account3);
        }).then(function (balance) {
            assert.equal(balance.toString(), balance3.toString(), "balance incorrect after transferFrom");
            balance3 = balance;
        }).then(function () {


        }).then(function () {


        });
    });
});

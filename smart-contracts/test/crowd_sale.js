var FairGameCrowdSale = artifacts.require("./FairGameCrowdSale.sol");
var FairToken = artifacts.require("./FairToken.sol");


contract('FairGameCrowdSale', function (accounts) {
    var ico;
    var token;

    var account1 = accounts[0];
    var account2 = accounts[1];

    var icoTokenAllowance   = 200000;   // 20W FAIR Token
    var goalInEther   = 10;   // 10 ETH


    it("Init Crowd Sale Allowance", function () {
        return FairGameCrowdSale.deployed().then(function (instance) {
            ico = instance;
        }).then(function () {
            return FairToken.deployed();
        }).then(function (instance) {
            token = instance;
        }).then(function () {

            // Approve
            return token.approve(ico.address, web3.toWei(icoTokenAllowance, "ether"), {from: account1});
        }).then(function () {

            // Check Allowance
            return token.allowance(account1, ico.address);
        }).then(function (allowance) {
            assert.equal(web3.fromWei(allowance.toNumber(), "ether"), icoTokenAllowance, "Allowance error");
        }).then(function () {

        });
    });


    it("Test Start & Stage", function () {

        var startTime = 0;
        var endTime = 0;

        // isStarted
        return ico.isStarted().then(function (val) {
            console.log("isStarted:", val);
            assert.isFalse(val, "isSatarted error");
        }).then(function () {

            // amountGoal
            return ico.amountGoal();
        }).then(function (amount) {
            console.log("amountGoal:", web3.fromWei(amount.toNumber(), "ether"));
            assert.equal(amount.toNumber(), 0, "amountGoal error");
        }).then(function () {

            // Get Stage
            return ico.getCurrentStage();
        }).then(function (stage) {
            console.log("Current Stage:", stage.toNumber());
            assert.equal(stage.toNumber(), -1, "stage error");
        }).then(function () {

            // Start
            console.log("Start...");
            return ico.start(goalInEther);
        }).then(function () {

            // Get Stage
            return ico.getCurrentStage();
        }).then(function (stage) {
            console.log("Current Stage:", stage.toNumber());
            assert.equal(stage.toNumber(), 0, "stage error");
        }).then(function () {

            // isStarted
            return ico.isStarted();
        }).then(function (val) {
            console.log("isStarted:", val);
            assert.isTrue(val, "isSatarted error");
        }).then(function () {

            // amountGoal
            return ico.amountGoal();
        }).then(function (amount) {
            console.log("amountGoal:", web3.fromWei(amount.toNumber(), "ether"));
            assert.isAbove(amount.toNumber(), 0, "amountGoal error");
        }).then(function () {

            // isStarted
            return ico.isStarted();
        }).then(function (val) {
            console.log("isStarted:", val);
            assert.isTrue(val, "isSatarted error");
        }).then(function () {

            // startTime
            return ico.startTime();
        }).then(function (tm) {
            console.log("startTime:", tm.toNumber());
            startTime = tm;
            assert.isAbove(startTime.toNumber(), 0, "start time should be above 0");
        }).then(function () {

            // endTime
            return ico.endTime();
        }).then(function (tm) {
            console.log("endTime:", tm.toNumber());
            endTime = tm;
            assert.equal(endTime.minus(startTime).toNumber(), 60 * 60 * 24 *7 * 3, "end time error");
        }).then(function () {


        });

    });


    it("Test Purchase", function () {

        var ethPerSpent = 5;              // 5 ETH
        var tokenPerIssue = 5 * 12000;  //Token Units

        var amountGoal;
        var amountRaised;
        var amountTokenIssued;

        var buyerSpentEth;
        var buyerTakenToken;

        var buyerTokenBalance;

        
        function initDataBeforeBuyTokens() {

            // amountRaised
            return ico.amountRaised().then(function (amount) {
                amountRaised = amount;
                console.log("amountRaised:", web3.fromWei(amount.toNumber(), "ether"));
            }).then(function () {

                // amountTokenIssued
                return ico.amountTokenIssued();
            }).then(function (amount) {
                amountTokenIssued = amount;
                console.log("amountTokenIssued:", web3.fromWei(amount.toNumber(), "ether"));
            }).then(function () {

                // purchasers Info
                return ico.purchasers(account2);
            }).then(function (data) {
                console.log("Purchaser Address:", account2);
                console.log("amountEtherSpent:", web3.fromWei(data[0].toNumber(), "ether"));
                console.log("amountTokenTaken:", web3.fromWei(data[1].toNumber(), "ether"));
                buyerSpentEth = data[0];
                buyerTakenToken = data[1];
            }).then(function () {

                //Buyer Token Balance
                return token.balanceOf(account2);
            }).then(function (balance) {
                buyerTokenBalance = balance;
            }).then(function () {

            });
        }
        

        function checkDataAfterBuyTokens() {

            // amountRaised
            return ico.amountRaised().then(function (amount) {
                console.log("amountRaised:", web3.fromWei(amount.toNumber(), "ether"));
                assert.equal(web3.fromWei(amount.minus(amountRaised).toNumber(), "ether"), ethPerSpent, 'amountRaised error');
            }).then(function () {

                // amountTokenIssued
                return ico.amountTokenIssued();
            }).then(function (amount) {
                console.log("amountTokenIssued:", web3.fromWei(amount.toNumber(), "ether"));
                assert.equal(web3.fromWei(amount.minus(amountTokenIssued).toNumber(), "ether"), tokenPerIssue, 'amountTokenIssued error');
            }).then(function () {

                // purchasers Info
                return ico.purchasers(account2);
            }).then(function (data) {
                console.log("Purchaser Address:", account2);
                console.log("amountEtherSpent:", web3.fromWei(data[0].toNumber(), "ether"));
                console.log("amountTokenTaken:", web3.fromWei(data[1].toNumber(), "ether"));
                assert.equal(web3.fromWei(data[0].minus(buyerSpentEth).toNumber(), "ether"), ethPerSpent, 'buyerSpentEth error');
                assert.equal(web3.fromWei(data[1].minus(buyerTakenToken).toNumber(), "ether"), tokenPerIssue, 'buyerTakenToken error');
            }).then(function () {

                //Buyer Token Balance
                return token.balanceOf(account2);
            }).then(function (balance) {
                assert.equal(web3.fromWei(balance.minus(buyerTokenBalance).toNumber(), "ether"), tokenPerIssue, 'buyerTokenBalance error');
            }).then(function () {

            });
        }


        return ico.amountGoal().then(function (amount) {
            amountGoal = amount;
            console.log("Amount Goal In Ether:", web3.fromWei(amount.toNumber(), "ether"));
        }).then(function () {

            // isReachedGoal
            return ico.isReachedGoal();
        }).then(function (val) {
            assert.isFalse(val, "isReachedGoal error");
        }).then(function () {

            // isEnded
            return ico.isEnded();
        }).then(function (val) {
            console.log("isEnded:", val);
            assert.isFalse(val, "isEnded error");
        }).then(function () {

            //============== First Buy ===============
        }).then(initDataBeforeBuyTokens).then(function () {

            // Buy Tokens
            console.log("Start Buy Tokens...");
            return ico.sendTransaction({value: web3.toWei(ethPerSpent, "ether"), from: account2});
        }).then(function () {

        }).then(checkDataAfterBuyTokens).then(function () {

            // isReachedGoal
            return ico.isReachedGoal();
        }).then(function (val) {
            assert.isFalse(val, "isReachedGoal error");
        }).then(function () {

            // isEnded
            return ico.isEnded();
        }).then(function (val) {
            console.log("isEnded:", val);
            assert.isFalse(val, "isEnded error");
        }).then(function () {

            //============== Second Buy ===============
        }).then(initDataBeforeBuyTokens).then(function () {

            // Buy Tokens
            console.log("Start Buy Tokens...");
            return ico.sendTransaction({value: web3.toWei(ethPerSpent, "ether"), from: account2});
        }).then(function () {

        }).then(checkDataAfterBuyTokens).then(function () {

            // isReachedGoal
            return ico.isReachedGoal();
        }).then(function (val) {
            assert.isTrue(val, "isReachedGoal error");
        }).then(function () {

            // isEnded
            return ico.isEnded();
        }).then(function (val) {
            console.log("isEnded:", val);
            assert.isTrue(val, "isEnded error");
        }).then(function () {

        });
    });


    it("Test Withdraw", function () {
        var oldBalance = web3.eth.getBalance(account1);
        var icoBalance = web3.eth.getBalance(ico.address);

        return ico.safeWithdrawal({from: account1}).then(function () {

            var newBalance = web3.eth.getBalance(account1);
            var delta = newBalance.minus(oldBalance).toNumber();
            assert.isAbove(delta, 0, "safeWithdrawal failed!");
            assert.isAtMost(delta, icoBalance.toNumber(), "safeWithdrawal failed!");
            assert.equal(web3.eth.getBalance(ico.address).toNumber(), 0, "safeWithdrawal failed!");

        })

    });
});

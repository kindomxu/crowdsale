pragma solidity ^0.4.16;

import "./ERC20.sol";
import "./Ownable.sol";


contract CrowdSale is Ownable {

    // ERC20 Token
    ERC20 public token;

    // address where receives funds
    address public beneficiary;
    // address where provides tokens
    address public tokenHolder;

    // how many token units per wei
    uint public rate;

    // amount of goal in wei
    uint public amountGoal;

    // amount of current raised money in wei
    uint public amountRaised;

    // amount of tokens issued
    uint public amountTokenIssued;

    // Important Time
    uint public startTime;
    uint public endTime;

    // Stages Info
    struct Stage {
        uint duration;      // Duration in second of current stage
        uint bonusRate;     // 100 = 100%
    }
    Stage[] public stages;

    // Purchaser Info
    struct PurchaserInfo {
        uint amountEtherSpent;
        uint amountTokenTaken;
    }
    mapping(address => PurchaserInfo) public purchasers;


    // ----- Events -----
    event TokenPurchase(address purchaser, uint value, uint amountTokens);
    event GoalReached(uint totalAmountRaised, uint totalTokenIssued);
    event FundingWithdrawn(address beneficiaryAddress, uint value);


    // ----- Modifiers -----
    modifier afterEnded {
        require(isEnded());
        _;
    }

    modifier onlyOpenTime {
        require(isStarted());
        require(!isEnded());
        _;
    }


    // ----- Functions -----
    function CrowdSale(address beneficiaryAddr, address tokenHolderAddr, address tokenAddr, uint tokenRate) public {
        require(beneficiaryAddr != address(0));
        require(tokenHolderAddr != address(0));
        require(tokenAddr != address(0));
        require(tokenRate > 0);

        beneficiary = beneficiaryAddr;
        tokenHolder = tokenHolderAddr;
        token = ERC20(tokenAddr);
        rate = tokenRate;

        _initStages();
    }

    function _initStages() internal;   //Need override

    function getTokenAddress() public view returns(address) {
        return token;
    }

    function isStarted() public view returns(bool) {
        return 0 < startTime && startTime <= now;
    }

    function isReachedGoal() public view returns(bool) {
        return amountRaised >= amountGoal;
    }

    function isEnded() public view returns(bool) {
        return now > endTime || isReachedGoal();
    }

    function getCurrentStage() public view returns(int) {
        int stageIdx = -1;
        uint stageEndTime = startTime;
        for(uint i = 0; i < stages.length; i++) {
            stageEndTime += stages[i].duration;
            if (now <= stageEndTime) {
                stageIdx = int(i);
                break;
            }
        }
        return stageIdx;
    }

    function getRemainingTimeInSecond() public view returns(uint) {
        if(endTime == 0)
            return 0;
        return endTime - now;
    }

    function start(uint fundingGoalInEther) public onlyOwner {
        require(!isStarted());
        require(fundingGoalInEther > 0);
        amountGoal = fundingGoalInEther * 1 ether;

        startTime = now;

        uint duration = 0;
        for(uint i = 0; i < stages.length; i++){
            duration += stages[i].duration;
        }

        endTime = startTime + duration;
    }

    function () payable public onlyOpenTime {
        require(msg.value > 0);

        uint amount = msg.value;
        uint tokenCount = _getTokenCount(amount);

        PurchaserInfo storage pi = purchasers[msg.sender];
        pi.amountEtherSpent += amount;
        pi.amountTokenTaken += tokenCount;

        amountRaised += amount;
        amountTokenIssued += tokenCount;

        token.transferFrom(tokenHolder, msg.sender, tokenCount);
        TokenPurchase(msg.sender, amount, tokenCount);
    }

    function _getTokenCount(uint amountInWei) internal view returns(uint) {
        uint buyTokenCount = amountInWei * rate;

        int stageIdx = getCurrentStage();
        assert(stageIdx >= 0 && uint(stageIdx) < stages.length);
        uint bonus = buyTokenCount * stages[uint(stageIdx)].bonusRate / 100;

        return buyTokenCount + bonus;
    }

    function safeWithdrawal() public afterEnded onlyOwner {
        require(beneficiary != address(0));
        beneficiary.transfer(amountRaised);
        FundingWithdrawn(beneficiary, amountRaised);
    }
}

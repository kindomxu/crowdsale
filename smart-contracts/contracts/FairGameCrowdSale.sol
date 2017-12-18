pragma solidity ^0.4.0;

import "./CrowdSale.sol";


contract FairGameCrowdSale is CrowdSale {
    function FairGameCrowdSale(address beneficiaryAddr, address tokenHolderAddr, address tokenAddr)
        CrowdSale(beneficiaryAddr, tokenHolderAddr, tokenAddr, 10000) public {

    }

    function _initStages() internal {
        delete stages;

        stages.push(Stage({bonusRate: 20, duration: 1 weeks}));
        stages.push(Stage({bonusRate: 10, duration: 1 weeks}));
        stages.push(Stage({bonusRate: 0, duration: 1 weeks}));
    }
}

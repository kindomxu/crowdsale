pragma solidity ^0.4.16;

import "./CrowdSale.sol";


contract FairGameCrowdSale is CrowdSale {
    function FairGameCrowdSale(address beneficiaryAddr, address tokenHolderAddr, address tokenAddr)
        CrowdSale(beneficiaryAddr, tokenHolderAddr, tokenAddr, 10000) public {

    }

    function _initStages() internal {
        delete icoStages;

        icoStages.push(Stage({rate: 20, duration: 1 weeks}));
        icoStages.push(Stage({rate: 10, duration: 1 weeks}));
        icoStages.push(Stage({rate: 0,  duration: 1 weeks}));


        delete lockStages;

        lockStages.push(Stage({rate: 33, duration: 30 days}));
        lockStages.push(Stage({rate: 33, duration: 30 days}));
        lockStages.push(Stage({rate: 34, duration: 30 days}));
    }
}

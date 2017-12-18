pragma solidity ^0.4.16;

import "./TokenERC20.sol";


contract FairToken is TokenERC20 {

    function FairToken() TokenERC20(1200000000, "Fair Token", "FAIR", 18) public {

    }
}


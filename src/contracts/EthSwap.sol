// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    
    string public name = "EthSwap Instant Exchange"; // state variable (stored on the blockchain)
    Token public token; // state variable
    uint public rate = 100;

    constructor(Token _token) public {
        token = _token; // _token is a local variable
    }

    function buyTokens() public payable {
        // Token amount equals the value of ethers sent in DApp Tokens
        uint tokenAmount = msg.value * rate; // msg.value equals the amount of ether sent when this function is called
        token.transfer(msg.sender, tokenAmount); // msg.sender is the caller of this function
    }

}
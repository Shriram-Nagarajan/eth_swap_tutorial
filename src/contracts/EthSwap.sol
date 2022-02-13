// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    
    string public name = "EthSwap Instant Exchange"; // state variable (stored on the blockchain)
    Token public token; // state variable
    uint public rate = 100; // 1 ether = 100 DApp tokens

    event TokenPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(Token _token) public {
        token = _token; // _token is a local variable
    }

    function buyTokens() public payable {
        // Token amount equals the value of ethers sent in DApp Tokens
        uint tokenAmount = msg.value * rate; // msg.value equals the amount of ether sent when this function is called

        require(token.balanceOf(address(this)) >= tokenAmount, "Balance less than requested tokens");
        token.transfer(msg.sender, tokenAmount); // msg.sender is the caller of this function

        // Emit TokenPurchased event
        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);
    }

}
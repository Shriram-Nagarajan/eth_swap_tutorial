// SPDX-License-Identifier: MIT

pragma solidity ^0.5.0;

import "./Token.sol";

contract EthSwap {
    
    string public name = "EthSwap Instant Exchange"; // state variable (stored on the blockchain)
    Token public token; // state variable
    uint public rate = 100; // 1 ether = 100 DApp tokens

    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
    );

     event TokensSold(
        address account,
        address token,
        uint amount,
        uint rate
    );
    
    constructor(Token _token) public {
        token = _token; // _token is a local variable
    }

    // Sender sends ether, buys tokens
    function buyTokens() public payable {
        // Token amount equals the value of ethers sent in DApp Tokens
        uint tokenAmount = msg.value * rate; // msg.value equals the amount of ether sent when this function is called

        require(token.balanceOf(address(this)) >= tokenAmount, "Balance less than requested tokens");
        token.transfer(msg.sender, tokenAmount); // msg.sender is the caller of this function

        // Emit TokensPurchased event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    // Sender sells token, receives ether
    function sellTokens(uint _amount) public {
         // User can't sell more tokens than they have
         // IMPORTANT NOTE: Generally ERC20 tokens handle this error when selling tokens,
         // this is just for tutorial purposes
         require(token.balanceOf(msg.sender) >= _amount);

         uint etherAmount = _amount / rate;
         require(address(this).balance >= etherAmount);

         token.transferFrom(msg.sender, address(this), _amount);
         msg.sender.transfer(etherAmount);

        // Emit TokensSold event
        emit TokensSold(msg.sender, address(token), _amount, rate);
    }

}
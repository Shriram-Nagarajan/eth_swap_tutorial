const EthSwap = artifacts.require("EthSwap");
const Token = artifacts.require("Token");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}


contract('EthSwap', ([deployer, investor]) => {

    let ethSwap, token;
    before(async() => {
        token = await Token.new();
        ethSwap = await EthSwap.new(token.address);
        await token.transfer(ethSwap.address, tokens('1000000'));
    });

    describe('Ethswap deployment', async() => {
        it('contract has name', async() => {
            const name = await ethSwap.name();
            assert.equal(name, 'EthSwap Instant Exchange');
        });
    });

    describe('Token deployment', async() => {
        it('contract has name', async() => {
            const name = await token.name();
            assert.equal(name, 'DApp Token');
        });

        it('contract has tokens', async() => {
            const balance = await token.balanceOf(ethSwap.address);
            assert.equal(balance, tokens('1000000'));
        });
    })

    describe('buyTokens() method', async() => {

        let result;

        before(async() => {
            // the investor swaps their 1 ether to get 100 DApp tokens
            result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1')});
        });
        it('purchase tokens for fixed price', async() => {
            let investorBalance = await token.balanceOf(investor);
            // Check if DApp tokens are added to investor account
            assert.equal(investorBalance.toString(), tokens('100'));

            // check ethSwap's token balance, should be debited by 100 DApp tokens (= 1 Ether)
            let ethSwapBalance = await token.balanceOf(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), tokens('999900'));

            // check ethSwap's ether balance, should be credited by 1 Ether
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address);
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'));

            const event = result.logs[0].args;
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount, tokens('100').toString());
            assert.equal(event.rate.toString(), '100');
        });
    })

});
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
        it('purchase tokens for fixed price', async() => {
            await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1')});
        });
    })

});
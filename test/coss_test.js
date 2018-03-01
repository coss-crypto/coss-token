const COSSToken = artifacts.require('./COSSToken.sol');
const ERC20Sample = artifacts.require('./ERC20Sample.sol');

const timer = require('./helpers/timer');
const BigNumber = web3.BigNumber;

function isException(error) {
    let strError = error.toString()
    return strError.includes('invalid opcode') || strError.includes('invalid JUMP') || strError.includes('revert')
}

function ensuresException(error) {
    assert(isException(error), error.toString())
}

/** Returns last block's timestamp */
function getBlockNow() {
    return web3.eth.getBlock(web3.eth.blockNumber).timestamp // base timestamp off the blockchain
}

contract(
    'LuckTokenCrowdsale',
    (
        [
            owner,
            guy1,
            guy2,
            guy3,
            guy4
        ]
    ) => {
        
        var mToken = null;
        var oldToken = null;
        var anotherToken = null;
        var accounts;
        const initialBalance = 500;

        beforeEach('initialize contract', async () => {
            accounts = getAccounts();
            mToken = await COSSToken.new();
            var accountsWithOldToken = getAccounts();
            accountsWithOldToken.push();
            anotherToken = await ERC20Sample.new([mToken.address], initialBalance);
            oldToken = await ERC20Sample.new(accounts, initialBalance); 
            mToken.setOldTokenAddress(oldToken.address);
        });

        it("should test that balances get moved", async () => {
            (await oldToken.balanceOf(guy1)).should.be.bignumber.equal(initialBalance);
            await mToken.replaceToken(accounts);
            for (var i=0; i < accounts.length; i++){
                (await mToken.balanceOf(accounts[i])).should.be.bignumber.equal(initialBalance);
            }
        }); 

        it("should test that sendTokens() works as intended", async () => {
            (await anotherToken.balanceOf(guy1)).should.be.bignumber.equal(0);
            (await anotherToken.balanceOf(mToken.address)).should.be.bignumber.equal(initialBalance);
            await mToken.sendTokens(guy1, anotherToken.address, 1);
            (await anotherToken.balanceOf(guy1)).should.be.bignumber.equal(1);
            (await anotherToken.balanceOf(mToken.address)).should.be.bignumber.equal(initialBalance-1);
            
            await mToken.setDistributor(guy3);
            try{
                await mToken.sendTokens(guy1, anotherToken.address, 1, {from: guy4});
                assert.fail();
            }catch(e){
                ensuresException(e);
            }
            await mToken.sendTokens(guy1, anotherToken.address, 1, {from: guy3});
            (await anotherToken.balanceOf(guy1)).should.be.bignumber.equal(2);
            (await anotherToken.balanceOf(mToken.address)).should.be.bignumber.equal(initialBalance-2);
        });

        it ("should test that sendEther() works as intended", async () => {
            var initialGuy1Balance = await web3.eth.getBalance(guy1);
            await web3.eth.sendTransaction({from: guy1, to: mToken.address, value: 300});
            (await web3.eth.getBalance(mToken.address)).should.be.bignumber.equal(300);

            var initialGuy2Balance = await web3.eth.getBalance(guy2);
            await mToken.sendEther(guy2, 150);
            (await web3.eth.getBalance(guy2)).should.be.bignumber.equal(initialGuy2Balance.plus(150));
            (await web3.eth.getBalance(mToken.address)).should.be.bignumber.equal(150);

            await mToken.setDistributor(guy3);

            try{
                await mToken.sendEther(guy2, 50, {from: guy4});
                assert.fail();
            }catch(e){
                ensuresException(e);
            }
            await mToken.sendEther(guy2, 150, {from: guy3});
            (await web3.eth.getBalance(guy2)).should.be.bignumber.equal(initialGuy2Balance.plus(300));
            (await web3.eth.getBalance(mToken.address)).should.be.bignumber.equal(0);
        });

        it ("should test revenueShareIdentifier works as intended", async () =>{
            await mToken.activateRevenueShareIdentifier("me");
            await mToken.activateRevenueShareIdentifier("guy1", {from: guy1});
            const shouldBeMe = await mToken.revenueShareIdentifierList(await mToken.owner());
            const shouldBeGuy1 = await mToken.revenueShareIdentifierList(guy1);

            assert.equal(shouldBeMe, "me");
            assert.equal(shouldBeGuy1, "guy1");

        });

        it ("should test that token can be transfered", async () => {
            (await oldToken.balanceOf(guy1)).should.be.bignumber.equal(initialBalance);
            await mToken.replaceToken(accounts);
            
            await mToken.transfer(guy4, 300, {from: guy1});


            (await mToken.balanceOf(guy4)).should.be.bignumber.equal(300);
        });

        //helpers
        function getAccounts() {
            var accounts = [];
            accounts.push(guy1);
            accounts.push(guy2);
            accounts.push(guy3);
            return accounts;
        }
    }
);

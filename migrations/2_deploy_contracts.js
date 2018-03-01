const Settings = require('../utils/settings');
const BigNumber = web3.BigNumber;
const dayInSecs = 86400;
const COSSToken = artifacts.require('./COSSToken.sol');


Settings.startTime = web3.eth.getBlock(web3.eth.blockNumber).timestamp + 80;
Settings.endTime = Settings.startTime + dayInSecs * 60;
Settings.rate = new BigNumber(500);

module.exports = async function(deployer, network, [_, wallet]) {
    return deployer.then(() => {
        return deployer.deploy(COSSToken);
    });


};

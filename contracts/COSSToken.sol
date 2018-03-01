pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './ERC223Token.sol';
import './Distributable.sol';

contract COSSToken is ERC223Token, Ownable, Distributable {

    event RevenueShareIdentifierCreated (
        address indexed _address, 
        string _identifier);

    string public name    = "COSS";
    string public symbol  = "COSS";
    uint256 public decimals = 18;

    using SafeMath for uint;

    address public oldTokenAddress;

    mapping (address => string) public revenueShareIdentifierList;

    function COSSToken() {
        owner = msg.sender;
        totalSupply_ = 200000000 * (10 ** decimals);
    }

    function setOldTokenAddress(address _oldTokenAddress) public onlyOwner {
        oldTokenAddress = _oldTokenAddress;
    }

    function replaceToken(address[] _addresses) public onlyOwnerOrDistributor {
        uint256 addressCount = _addresses.length;
        for (uint256 i = 0; i < addressCount; i++) {
            address currentAddress = _addresses[i];
            uint256 balance = ERC20(oldTokenAddress).balanceOf(currentAddress);
            balances[currentAddress] = balance;
        }
    }

    function() payable { 
    
    }

    function activateRevenueShareIdentifier(string _revenueShareIdentifier) {
        revenueShareIdentifierList[msg.sender] = _revenueShareIdentifier;
        RevenueShareIdentifierCreated(msg.sender, _revenueShareIdentifier);
    }

    function sendTokens(address _destination, address _token, uint256 _amount) public onlyOwnerOrDistributor {
         ERC20(_token).transfer(_destination, _amount);
    }

    function sendEther(address _destination, uint256 _amount) payable public onlyOwnerOrDistributor {
        _destination.transfer(_amount);
    }

    function setTransfersEnabled() public onlyOwner {
        transfersEnabled = true;
    }

}
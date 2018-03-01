pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract ERC20Sample is StandardToken {
    function ERC20Sample(address[] _addresses, uint _balance) {
        for (uint i = 0; i < _addresses.length; i++) {
            address currentAddress = _addresses[i];
            balances[currentAddress] = _balance;
        }
    }
}
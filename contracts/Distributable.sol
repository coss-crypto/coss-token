pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Distributable is Ownable {
    
    address public distributor;

    function setDistributor(address _distributor) public onlyOwner {
        distributor = _distributor;
    }

    modifier onlyOwnerOrDistributor(){
        require(msg.sender == owner || msg.sender == distributor);
        _;
    }
}
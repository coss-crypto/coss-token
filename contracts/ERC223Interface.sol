pragma solidity ^0.4.18;

contract ERC223Interface {
    function transfer(address to, uint value, bytes data) returns (bool);
    event Transfer(address indexed from, address indexed to, uint value);
}
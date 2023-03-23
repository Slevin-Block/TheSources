// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SimpleStorage {

    address public owner;
    uint public s_value;

    event Stock(uint value);

    constructor()  {
        owner = msg.sender;
    }

    function setOwner() public {
        owner = msg.sender;
    }

    function deposit(uint _value) public {
        require(_value > 0, "Empty value");
        require(msg.sender == owner, "You aren't the owner");
        s_value = _value;
        emit Stock(s_value);
    }
}

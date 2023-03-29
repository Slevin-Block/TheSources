// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Article is ERC1155, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 fees = 1 ether;

    constructor() ERC1155("") {}

    function mint(uint256 amount, bytes  memory data) public payable {
        require(msg.value >= amount * fees, "Not enough fund");
        // Require pour ne permettre de minter que les personnes inscritent.

        _tokenIds.increment();
        _mint(msg.sender, _tokenIds.current(), amount, data);
    }

    function withdraw() public onlyOwner {
        require(address(this).balance > 0 , "Balance is 0");
        payable(owner()).transfer(address(this).balance);
    }

}

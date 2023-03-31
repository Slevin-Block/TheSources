// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "./TheSourceMembreToken.sol";

contract TheSourceMarketPlace is Ownable {

    TheSourceMembreToken private memberToken;

    constructor(address _addr){
        memberToken = TheSourceMembreToken(_addr);
    }

    function getSymbol() public view returns (string memory) {
        string memory symb = TheSourceMembreToken(memberToken).symbol();
        return symb;
    }

    function getAddressToken()public view returns (address) {
        return address(memberToken);
    }

    function mintMemberToken(address to) public returns (uint256){
        uint256 tokenId = memberToken.safeMint(to);
        return tokenId;
    }

}

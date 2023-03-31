// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract TheSourceMembreToken is ERC721, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("TheSourceMembreToken", "TSMT") {}

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHwpg93jGwgqQtjYFJAaRtRD3Tt8FQIs1ebw";
    }

    function safeMint(address to) public onlyOwner returns (uint256){
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        return tokenId;
    }

}

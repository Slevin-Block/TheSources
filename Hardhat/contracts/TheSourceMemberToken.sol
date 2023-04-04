// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/*********************************************************************************************************************
  _____ _          _____                                     _   _ ______ ________  ___               _               
 |_   _| |        /  ___|                                   | \ | ||  ___|_   _|  \/  |              | |              
   | | | |__   ___\ `--.  ___  _   _ _ __ ___ ___   ______  |  \| || |_    | | | .  . | ___ _ __ ___ | |__   ___ _ __ 
   | | | '_ \ / _ \`--. \/ _ \| | | | '__/ __/ _ \ |______| | . ` ||  _|   | | | |\/| |/ _ \ '_ ` _ \| '_ \ / _ \ '__|
   | | | | | |  __/\__/ / (_) | |_| | | | (_|  __/          | |\  || |     | | | |  | |  __/ | | | | | |_) |  __/ |   
   \_/ |_| |_|\___\____/ \___/ \__,_|_|  \___\___|          \_| \_/\_|     \_/ \_|  |_/\___|_| |_| |_|_.__/ \___|_|   
                                                                                                                      

*********************************************************************************************************************/

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";



/*********************************************************************************************************************
     _   _ ______ ________  ___               _               
    | \ | ||  ___|_   _|  \/  |              | |              
    |  \| || |_    | | | .  . | ___ _ __ ___ | |__   ___ _ __ 
    | . ` ||  _|   | | | |\/| |/ _ \ '_ ` _ \| '_ \ / _ \ '__|
    | |\  || |     | | | |  | |  __/ | | | | | |_) |  __/ |   
    \_| \_/\_|     \_/ \_|  |_/\___|_| |_| |_|_.__/ \___|_|   

*********************************************************************************************************************/

contract TheSourceMemberToken is ERC721URIStorage, Ownable {

    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;
    uint256 public royalties;  // on 1000 => 2.5% corresponds to 25
    string base;

 
    constructor(address _marketPlaceAddr, uint256 _royalties, string memory baseURI_) ERC721("TheSourceMembreToken", "TSMT") {
        transferOwnership(_marketPlaceAddr);
        royalties = _royalties;
        base = baseURI_;
    }


    function _baseURI() internal view override returns (string memory) {
        return base;
    }

    function getNumberOfMemberToken() public view returns (uint256){
        return _tokenIds.current();
    }

    event mint(address _to, uint256 tokenId);

    function safeMint( address _to) external onlyOwner returns (uint256) {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _safeMint(_to, tokenId);
        string memory refTokenURI = string(abi.encodePacked(tokenId.toString(), ".json"));
        _setTokenURI(tokenId, refTokenURI);

        emit mint(_to, tokenId);

        return tokenId;
    }
}

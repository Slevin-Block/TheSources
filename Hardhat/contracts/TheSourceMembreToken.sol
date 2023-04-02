// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

/*********************************************************************************************************************
  _____ _          _____                                     _   _ ______ _____  ___  ___               _              
 |_   _| |        /  ___|                                   | \ | ||  ___|_   _| |  \/  |              | |             
   | | | |__   ___\ `--.  ___  _   _ _ __ ___ ___   ______  |  \| || |_    | |   | .  . | ___ _ __ ___ | |__  _ __ ___ 
   | | | '_ \ / _ \`--. \/ _ \| | | | '__/ __/ _ \ |______| | . ` ||  _|   | |   | |\/| |/ _ \ '_ ` _ \| '_ \| '__/ _ \
   | | | | | |  __/\__/ / (_) | |_| | | | (_|  __/          | |\  || |     | |   | |  | |  __/ | | | | | |_) | | |  __/
   \_/ |_| |_|\___\____/ \___/ \__,_|_|  \___\___|          \_| \_/\_|     \_/   \_|  |_/\___|_| |_| |_|_.__/|_|  \___|
                                                                                                                      

*********************************************************************************************************************/

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/utils/Strings.sol";



/*********************************************************************************************************************
     ______                  _ _ _   _           
     | ___ \                | (_) | (_)          
     | |_/ /___  _   _  __ _| |_| |_ _  ___  ___ 
     |    // _ \| | | |/ _` | | | __| |/ _ \/ __|
     | |\ \ (_) | |_| | (_| | | | |_| |  __/\__ \
     \_| \_\___/ \__, |\__,_|_|_|\__|_|\___||___/
                  __/ |                          
                 |___/                           
*********************************************************************************************************************/
interface IERC2981Royalties1 {
    function royaltyInfo(uint256 _tokenId, uint256 _value)
        external
        view
        returns (address _receiver, uint256 _royaltyAmount);
}

contract Royalties1 is IERC2981Royalties1, ERC165 {
    struct RoyaltyInfo {
        address recipient;
        uint24 amount;
    }

    mapping(uint256 => RoyaltyInfo) internal _royalties;

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IERC2981Royalties1).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _setTokenRoyalty(
        uint256 tokenId,
        address recipient,
        uint256 value
    ) internal {
        require(value <= 10000, "ERC2981Royalties: Too high");
        _royalties[tokenId] = RoyaltyInfo(recipient, uint24(value));
    }

    function royaltyInfo(uint256 tokenId, uint256 value)
        external
        view
        override
        returns (address receiver, uint256 royaltyAmount)
    {
        RoyaltyInfo memory royalties = _royalties[tokenId];
        receiver = royalties.recipient;
        royaltyAmount = (value * royalties.amount) / 10000;
    }
}

/*********************************************************************************************************************
      _   _ ______ _____  ___  ___               _              
     | \ | ||  ___|_   _| |  \/  |              | |             
     |  \| || |_    | |   | .  . | ___ _ __ ___ | |__  _ __ ___ 
     | . ` ||  _|   | |   | |\/| |/ _ \ '_ ` _ \| '_ \| '__/ _ \
     | |\  || |     | |   | |  | |  __/ | | | | | |_) | | |  __/
     \_| \_/\_|     \_/   \_|  |_/\___|_| |_| |_|_.__/|_|  \___|

*********************************************************************************************************************/

contract TheSourceMembreToken is ERC721URIStorage, Royalties1, Ownable {

    using Counters for Counters.Counter;
    using Strings for uint256;

    Counters.Counter private _tokenIds;
    uint256 public royalties;
    string base;

 
    constructor(address _marketPlaceAddr, uint256 _royalties, string memory baseURI_) ERC721("TheSourceMembreToken", "TSMT") {
        transferOwnership(_marketPlaceAddr);
        royalties = _royalties;
        base = baseURI_;
    }


    function _baseURI() internal view override returns (string memory) {
        return base;
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

   function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, Royalties1)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

}

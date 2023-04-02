// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;


/*********************************************************************************************************************
      _____ _          _____                                     ___________ _____    ___       _   _      _      
      |_   _| |        /  ___|                                   /  ___|  ___|_   _|  / _ \     | | (_)    | |     
        | | | |__   ___\ `--.  ___  _   _ _ __ ___ ___   ______  \ `--.| |_    | |   / /_\ \_ __| |_ _  ___| | ___ 
        | | | '_ \ / _ \`--. \/ _ \| | | | '__/ __/ _ \ |______|  `--. \  _|   | |   |  _  | '__| __| |/ __| |/ _ \
        | | | | | |  __/\__/ / (_) | |_| | | | (_|  __/          /\__/ / |     | |   | | | | |  | |_| | (__| |  __/
        \_/ |_| |_|\___\____/ \___/ \__,_|_|  \___\___|          \____/\_|     \_/   \_| |_/_|   \__|_|\___|_|\___|



*********************************************************************************************************************/


import "../node_modules/@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";



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

interface IERC2981Royalties2 {
    function royaltyInfo(uint256 _tokenId, uint256 _value)
        external
        view
        returns (address _receiver, uint256 _royaltyAmount);
}

contract Royalties2 is IERC2981Royalties2, ERC165 {
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
            interfaceId == type(IERC2981Royalties2).interfaceId ||
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
       ___________ _____    ___       _   _      _      
      /  ___|  ___|_   _|  / _ \     | | (_)    | |     
      \ `--.| |_    | |   / /_\ \_ __| |_ _  ___| | ___ 
       `--. \  _|   | |   |  _  | '__| __| |/ __| |/ _ \
      /\__/ / |     | |   | | | | |  | |_| | (__| |  __/
      \____/\_|     \_/   \_| |_/_|   \__|_|\___|_|\___|

*********************************************************************************************************************/

contract TheSourceArticle is ERC1155URIStorage, Royalties2, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _articleIdCounter;
    uint256 royalties;

    constructor(address _marketPlaceAddr, uint256 _royalties) ERC1155("") {
        Article memory genesis = Article("Genesis", "", "", address(0), 0, 0);
        articles.push(genesis);
        transferOwnership(_marketPlaceAddr);
        royalties = _royalties;
    }

    struct Article {
        string title;
        string description; // 15 chars max (use limitChars to generate it if too long)
        string authorName;
        address authorAddress;
        uint256 supply;
        uint256 priceInFinney;
    }

    Article[] articles;

    function safeMint(
        address _authorAddress,
        string calldata _title,
        string calldata _description,
        string calldata _authorName,
        uint256 _supply,
        uint256 _priceInFinney,
        string memory URI
    ) public onlyOwner returns (uint256) {
        _articleIdCounter.increment();
        uint256 articleId = _articleIdCounter.current();
        string memory description = limitChars(_description);
        articles.push(
            Article(
                _title,
                description,
                _authorName,
                _authorAddress,
                _supply,
                _priceInFinney
            )
        );
        _mint(_authorAddress, articleId, _supply, "");
        _setURI(articleId, URI);
        _setTokenRoyalty(articleId, owner(), royalties);
        return articleId;
    }



    function getArticle(uint256 _articleId)
        public
        view
        returns (Article memory)
    {
        return articles[_articleId];
    }



    function getRoyalties() public view returns (uint256){
        return royalties;
    }



    function setRoyalties(uint256 _royalties) public onlyOwner{
        require(_royalties < 100000, "Wrong number, too big");
        require(_royalties > 0, "Wrong number, negatif");
        royalties = _royalties;
    }



    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        //_mintBatch(to, ids, amounts, data);
    }



    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, Royalties2)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }



    function limitChars(string memory str)
        internal
        pure
        returns (string memory)
    {
        uint8 limit = 15;
        bytes memory strBytes = bytes(str);

        if (strBytes.length <= limit) {
            return str;
        } else {
            bytes memory resultBytes = new bytes(limit - 3);
            for (uint256 i = 0; i < limit - 3; i++) {
                resultBytes[i] = strBytes[i];
            }
            resultBytes = abi.encodePacked(resultBytes, "...");
            return string(resultBytes);
        }
    }
}

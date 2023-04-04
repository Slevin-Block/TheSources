// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

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
       ___________ _____    ___       _   _      _      
      /  ___|  ___|_   _|  / _ \     | | (_)    | |     
      \ `--.| |_    | |   / /_\ \_ __| |_ _  ___| | ___ 
       `--. \  _|   | |   |  _  | '__| __| |/ __| |/ _ \
      /\__/ / |     | |   | | | | |  | |_| | (__| |  __/
      \____/\_|     \_/   \_| |_/_|   \__|_|\___|_|\___|

*********************************************************************************************************************/

contract TheSourceArticle is ERC1155URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _articleIdCounter;
    uint256 public royalties; //base 1000 for percentage

    constructor(address _marketPlaceAddr, uint256 _royalties) ERC1155("") {
        Article memory genesis = Article("Genesis", "", "", address(0), 0, 0);
        articles.push(genesis);
        transferOwnership(_marketPlaceAddr);
        royalties =_royalties;
    }

    struct Article {
        string title;
        string description; // 15 chars max (use limitChars to generate it if too long)
        string authorName;
        address authorAddress;
        uint256 supply;
        uint256 price;
    }

    Article[] articles;

    function safeMint(
        string calldata _title,
        string calldata _description,
        string calldata _authorName,
        address _authorAddress,
        uint256 _totalSupply,
        uint256 _priceInFinney,
        string memory URI
    ) public onlyOwner returns (uint256) {
        _articleIdCounter.increment();
        uint256 articleId = _articleIdCounter.current();
        string memory description_ = limitChars(_description, 15);
        articles.push(
            Article(
                _title,
                description_,
                _authorName,
                _authorAddress,
                _totalSupply,
                _priceInFinney
            )
        );
        _mint(_authorAddress, articleId, _totalSupply, "");
        _setApprovalForAll(_authorAddress, msg.sender ,true);
        _setURI(articleId, URI);
        return articleId;
    }

    function buyArticle(address _seller, uint256 _articleId, uint256 amount) external {
        (,, address author) = getArticleInfos(_articleId);
        safeTransferFrom(author, _seller, _articleId, 1, "");
        articles[_articleId].supply-= amount;
    }

    function getArticle(uint256 _articleId) public view returns (Article memory) {
        require(_articleId > 0, "Invalid index");
        require(_articleId < articles.length, "Invalid index");
        return articles[_articleId];
    }

    function getArticleInfos(uint256 _articleId) public view returns (uint256, uint256, address) {
        require(_articleId > 0, "Invalid index");
        require(_articleId < articles.length, "Invalid index");
        return (articles[_articleId].supply, articles[_articleId].price, articles[_articleId].authorAddress);
    }

    function getNumberOfArticles() public view returns (uint256){
        return _articleIdCounter.current();
    }

    function limitChars(string memory str, uint256 limit)
        internal
        pure
        returns (string memory)
    {
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

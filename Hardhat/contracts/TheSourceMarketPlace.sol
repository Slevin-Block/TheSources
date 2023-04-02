// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./TheSourceMembreToken.sol";
import "./TheSourceArticle.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract TheSourceMarketPlace is Ownable {
    /*************************************************************
  ___      _ _   _      _ _          _   _          
 |_ _|_ _ (_) |_(_)__ _| (_)___ __ _| |_(_)___ _ _  
  | || ' \| |  _| / _` | | (_-</ _` |  _| / _ \ ' \ 
 |___|_||_|_|\__|_\__,_|_|_/__/\__,_|\__|_\___/_||_|

*************************************************************/

    using Counters for Counters.Counter;

    TheSourceMembreToken private memberTokenContract;
    TheSourceArticle private articleContract;

    Counters.Counter private memberTokenCounter;
    Counters.Counter private articleCounter;
    uint256 private memberTokenPriceInFinney;
    uint256 private articlePriceInFinney;

    event membershipPrice(uint256 newPrice);
    event articlePrice(uint256 newPrice);

    function init(
        address _memberTokenAddr,
        uint256 _memberTokenPriceInFinney,
        address _articleContract,
        uint256 _articlePriceInFinney
    ) public onlyOwner {
        memberTokenContract = TheSourceMembreToken(_memberTokenAddr);
        memberTokenPriceInFinney = _memberTokenPriceInFinney;
        articleContract = TheSourceArticle(_articleContract);
        articlePriceInFinney = _articlePriceInFinney;
    }

    /*************************************************************
  __  __           _            _____    _            
 |  \/  |___ _ __ | |__  ___ _ |_   _|__| |_____ _ _  
 | |\/| / -_) '  \| '_ \/ -_) '_|| |/ _ \ / / -_) ' \ 
 |_|  |_\___|_|_|_|_.__/\___|_|  |_|\___/_\_\___|_||_|

*************************************************************/

    /*  PRICE OF A MEMBER TOKEN*/
    function getMemberTokenPriceInFinney() public view returns (uint256) {
        return memberTokenPriceInFinney;
    }

    function setMemberTokenPriceInFinney(uint256 _newPrice) public onlyOwner {
        require(_newPrice > 0, "Price incorrect");
        memberTokenPriceInFinney = _newPrice;
        emit membershipPrice(_newPrice);
    }

    /* MANAGEMENT OF MEMBER TOKEN */
    function buyMembreToken() public payable returns (uint256) {
        require(msg.value * 1000 >= memberTokenPriceInFinney, "Not enough");
        memberTokenCounter.increment();
        uint256 tokenId = memberTokenContract.safeMint(msg.sender);
        return tokenId;
    }

    function balanceOfMemberToken() public view returns (uint256) {
        return memberTokenContract.balanceOf(msg.sender);
    }

    /* EVENTS */

    event createArticle(address from, uint256 memberTokenId, uint256 articleId);

    /*************************************************************
    _       _   _    _     
   /_\  _ _| |_(_)__| |___ 
  / _ \| '_|  _| / _| / -_)
 /_/ \_\_|  \__|_\__|_\___|

*************************************************************/

    /*  PRICE OF A Article*/
    function getArticlePriceInFinney() public view returns (uint256) {
        return articlePriceInFinney;
    }

    function setArticlePriceInFinney(uint256 _newPrice) public onlyOwner {
        require(_newPrice > 0, "Price incorrect");
        articlePriceInFinney = _newPrice;
        emit articlePrice(_newPrice);
    }

    function mintArticle(
        uint256 _memberTokenId,
        string calldata _title,
        string calldata _description,
        string calldata _authorName,
        uint256 _supply,
        uint256 _priceInFinney,
        string memory URI
    ) public payable returns (uint256) {
        // Has access
        require(memberTokenContract.ownerOf(_memberTokenId) == msg.sender,"Don't have access, buy or change MemberToken");
        // Has payed
        require(msg.value * 1000 >= articlePriceInFinney, "Not enough");

        articleCounter.increment();
        uint256 articleId = articleContract.safeMint(
            msg.sender,
            _title,
            _description,
            _authorName,
            _supply,
            _priceInFinney,
            URI
        );
        emit createArticle(msg.sender, _memberTokenId, articleId);
        return articleId;
    }


/*************************************************************
  __  __                                       _   
 |  \/  |__ _ _ _  __ _ __ _ ___ _ __  ___ _ _| |_ 
 | |\/| / _` | ' \/ _` / _` / -_) '  \/ -_) ' \  _|
 |_|  |_\__,_|_||_\__,_\__, \___|_|_|_\___|_||_\__|
                       |___/                       
*************************************************************/

    function withdraw(uint256 amount) public onlyOwner {
        require(amount > 0, "Amount must be greater than zero");
        require(
            address(this).balance >= amount,
            "Insufficient balance in contract"
        );
        payable(msg.sender).transfer(amount);
    }
}

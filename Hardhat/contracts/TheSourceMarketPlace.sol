// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/*********************************************************************************************************************
  _____ _          _____                                ___  ___           _        _         _                
 |_   _| |        /  ___|                               |  \/  |          | |      | |       | |               
   | | | |__   ___\ `--.  ___  _   _ _ __ ___ ___ ______| .  . | __ _ _ __| | _____| |_ _ __ | | __ _  ___ ___ 
   | | | '_ \ / _ \`--. \/ _ \| | | | '__/ __/ _ \______| |\/| |/ _` | '__| |/ / _ \ __| '_ \| |/ _` |/ __/ _ \
   | | | | | |  __/\__/ / (_) | |_| | | | (_|  __/      | |  | | (_| | |  |   <  __/ |_| |_) | | (_| | (_|  __/
   \_/ |_| |_|\___\____/ \___/ \__,_|_|  \___\___|      \_|  |_/\__,_|_|  |_|\_\___|\__| .__/|_|\__,_|\___\___|
                                                                                      | |                     
                                                                                      |_|                     
*********************************************************************************************************************/

import "./TheSourceMemberToken.sol";
import "./TheSourceArticle.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract TheSourceMarketPlace is Ownable, ReentrancyGuard {
/*************************************************************
  ___      _ _   _      _ _          _   _          
 |_ _|_ _ (_) |_(_)__ _| (_)___ __ _| |_(_)___ _ _  
  | || ' \| |  _| / _` | | (_-</ _` |  _| / _ \ ' \ 
 |___|_||_|_|\__|_\__,_|_|_/__/\__,_|\__|_\___/_||_|

*************************************************************/

    mapping(address => uint256) balances;

/* CONTRACTS */
    TheSourceMemberToken private memberTokenContract;
    TheSourceArticle private articleContract;

/* STATE */
    uint256 private memberTokenPrice;
    uint256 private articlePrice;

/* EVENTS */
    event membershipPrice(uint256 newPrice);
    event newArticlePrice(uint256 newPrice);
    event createArticle(address from, uint256 memberTokenId, uint256 articleId);

/* FUNCTION */

    constructor () ReentrancyGuard() {}

    function init(
        address _memberTokenAddr,
        uint256 _memberTokenPrice,
        address _articleContract,
        uint256 _articlePrice
    ) public onlyOwner{
        memberTokenContract = TheSourceMemberToken(_memberTokenAddr);
        memberTokenPrice = _memberTokenPrice;
        articleContract = TheSourceArticle(_articleContract);
        articlePrice = _articlePrice;
    }
    

/*************************************************************
  __  __           _            _____    _            
 |  \/  |___ _ __ | |__  ___ _ |_   _|__| |_____ _ _  
 | |\/| / -_) '  \| '_ \/ -_) '_|| |/ _ \ / / -_) ' \ 
 |_|  |_\___|_|_|_|_.__/\___|_|  |_|\___/_\_\___|_||_|

*************************************************************/

/*  PRICE OF A MEMBER TOKEN*/
    function getMemberTokenPrice() public view returns (uint256) {
        return memberTokenPrice;
    }

    function setMemberTokenPrice(uint256 _newPrice) public onlyOwner {
        memberTokenPrice = _newPrice;
        emit membershipPrice(_newPrice);
    }

/* MANAGEMENT OF MEMBER TOKEN */
    function buyMemberToken() public payable returns (uint256) {
        require(msg.value >= memberTokenPrice, "Not enough");
        uint256 tokenId = memberTokenContract.safeMint(msg.sender);
        balances[owner()] += msg.value;
        return tokenId;
    }

    function balanceOfMemberToken() public view returns (uint256) {
        return memberTokenContract.balanceOf(msg.sender);
    }


/*************************************************************
    _       _   _    _     
   /_\  _ _| |_(_)__| |___ 
  / _ \| '_|  _| / _| / -_)
 /_/ \_\_|  \__|_\__|_\___|

*************************************************************/

/*  PRICE OF A ARTICLE */
    function getArticlePrice() public view returns (uint256) {
        return articlePrice;
    }

    function setArticlePrice(uint256 _newPrice) public onlyOwner {
        articlePrice = _newPrice;
        emit newArticlePrice(_newPrice);
    }

/* MANAGEMENT OF ARTICLES */
    function mintArticle(
        uint256 _memberTokenId,
        string calldata _title,
        string calldata _description,
        string calldata _authorName,
        uint256 _supply,
        uint256 _price,
        string memory URI
    ) public payable returns (uint256) {
        // Has access
        require(memberTokenContract.ownerOf(_memberTokenId) == msg.sender, "Don't have access, buy or change MemberToken");
        // Has payed
        require(msg.value >= articlePrice, "Not enough");

        uint256 articleId = articleContract.safeMint(
            _title,
            _description,
            _authorName,
            msg.sender,
            _supply,
            _price,
            URI
        );
        balances[owner()] += msg.value;
        emit createArticle(msg.sender, _memberTokenId, articleId);
        return articleId;
    }

    function buyArticle(uint256 _articleId, uint256 _amount) public payable returns (bool){
        (uint256 supply, uint256 unitPrice, address author)= articleContract.getArticleInfos(_articleId);

        require(msg.value >= unitPrice * _amount, "Not enough");
        require(_amount <= supply, "Not enough supply");
        /* Verification of the existence of the index, into above getArticleInfos require */

        articleContract.buyArticle(msg.sender, _articleId, _amount);
        uint256 royalties = articleContract.royalties();
        uint256 ownerFees =  msg.value * royalties / 1000;
        balances[author] += msg.value - ownerFees;
        balances[owner()] += ownerFees;
        return true;
    }


/*************************************************************
  __  __                                       _   
 |  \/  |__ _ _ _  __ _ __ _ ___ _ __  ___ _ _| |_ 
 | |\/| / _` | ' \/ _` / _` / -_) '  \/ -_) ' \  _|
 |_|  |_\__,_|_||_\__,_\__, \___|_|_|_\___|_||_\__|
                       |___/                       
*************************************************************/

    function withdraw(uint256 amount) public nonReentrant{
        require(amount > 0, "Amount must be greater than zero");
        require(balances[msg.sender] >= amount, "Insufficient balance in contract");

        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value : amount}("");
        require(success, "Transfer failed.");
    }


    function myBalance() public view returns (uint256){
        return balances[msg.sender];
    }

    function balanceOf(address user) public view onlyOwner returns (uint256){
        return balances[user];
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        address oldOwner = owner();
        _transferOwnership(newOwner);
        balances[newOwner] += balances[oldOwner];
        balances[oldOwner] = 0;
    }

    receive() external payable {
        balances[owner()] += msg.value;
    }
}

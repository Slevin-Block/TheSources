// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

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

import "./TheSourceMembreToken.sol";
import "./TheSourceArticle.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/security/ReentrancyGuard.sol";



contract TheSourceMarketPlace is Ownable, ReentrancyGuard {
/*************************************************************
  ___      _ _   _      _ _          _   _          
 |_ _|_ _ (_) |_(_)__ _| (_)___ __ _| |_(_)___ _ _  
  | || ' \| |  _| / _` | | (_-</ _` |  _| / _ \ ' \ 
 |___|_||_|_|\__|_\__,_|_|_/__/\__,_|\__|_\___/_||_|

*************************************************************/

    using Counters for Counters.Counter;
    mapping(address => uint256) balancesInFinney;

/* CONTRACTS */
    TheSourceMembreToken private memberTokenContract;
    TheSourceArticle private articleContract;

/* STATE */
    Counters.Counter private memberTokenCounter;
    Counters.Counter private articleCounter;
    uint256 private memberTokenPriceInFinney;
    uint256 private articlePriceInFinney;

/* EVENTS */
    event membershipPrice(uint256 newPrice);
    event articlePrice(uint256 newPrice);
    event createArticle(address from, uint256 memberTokenId, uint256 articleId);

/* FUNCTION */

    constructor () ReentrancyGuard() {}

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
        balancesInFinney[owner()] += msg.value * 1000;
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
    function getArticlePriceInFinney() public view returns (uint256) {
        return articlePriceInFinney;
    }

    function setArticlePriceInFinney(uint256 _newPrice) public onlyOwner {
        require(_newPrice > 0, "Price incorrect");
        articlePriceInFinney = _newPrice;
        emit articlePrice(_newPrice);
    }

/* MANAGEMENT OF ARTICLES */
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
        require(memberTokenContract.ownerOf(_memberTokenId) == msg.sender, "Don't have access, buy or change MemberToken");
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
        balancesInFinney[owner()] += msg.value * 1000;
        emit createArticle(msg.sender, _memberTokenId, articleId);
        return articleId;
    }

    function buyArticle(uint256 _articleId) public payable returns (bool){
        articleContract.buyArticle(_articleId, msg.value);
        uint256 ownerFees =  msg.value * 1000 * 25 / 1000;
        balancesInFinney[owner()] += msg.value *1000 - ownerFees;
        balancesInFinney[owner()] += ownerFees;
        return true;
    }


/*************************************************************
  __  __                                       _   
 |  \/  |__ _ _ _  __ _ __ _ ___ _ __  ___ _ _| |_ 
 | |\/| / _` | ' \/ _` / _` / -_) '  \/ -_) ' \  _|
 |_|  |_\__,_|_||_\__,_\__, \___|_|_|_\___|_||_\__|
                       |___/                       
*************************************************************/

    /* function withdrawInFinney(uint256 amount) public {
        require(amount > 0, "Amount must be greater than zero");
        require( balancesInFinney[msg.sender] >= amount, "Insufficient balance in contract" );
        
    } */

    function withdrawInFinney(uint256 amount) public nonReentrant{
        require(amount > 0, "Amount must be greater than zero");
        require(balancesInFinney[msg.sender] >= amount, "Insufficient balance in contract");

        balancesInFinney[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value : amount / 1000}("");
        require(success, "Transfer failed.");
    }

    function transferOwnership(address newOwner) public override onlyOwner {
        address oldOwner = owner();
        _transferOwnership(newOwner);
        balancesInFinney[newOwner] += balancesInFinney[oldOwner];
        balancesInFinney[oldOwner] = 0;
    }
}

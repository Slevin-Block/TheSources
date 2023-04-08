import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect, assert } from "chai";
import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../typeschain-types/contracts/TheSourceMarketPlace"
import { TheSourceMemberToken } from "../typeschain-types/contracts/TheSourceMemberToken"
import { TheSourceArticle } from "../typeschain-types/contracts/TheSourceArticle"


/********************************************************************************
  _____ _          _____                               _____         _       
 |_   _| |        /  ___|                             |_   _|       | |      
   | | | |__   ___\ `--.  ___  _   _ _ __ ___ ___ ______| | ___  ___| |_ ___ 
   | | | '_ \ / _ \`--. \/ _ \| | | | '__/ __/ _ \______| |/ _ \/ __| __/ __|
   | | | | | |  __/\__/ / (_) | |_| | | | (_|  __/      | |  __/\__ \ |_\__ \
   \_/ |_| |_|\___\____/ \___/ \__,_|_|  \___\___|      \_/\___||___/\__|___/

********************************************************************************/

const ROYALTIES = 25;
const MEMBER_TOKEN_PRICE = 250000000000000000n;
const MINT_ARTICLE_PRICE = 250000000000000000n;
const BASE_URI_MEMBERTOKEN = "https://gateway.pinata.cloud/ipfs/QmQ41vE6evX9ysRiW3PJzf4UTeV5V6QTYcHCc6EcG3qtKa/"
const memberTokenId = 1
const title = "Test";
const description = "My description"
const authorName = "My and myself"
const supply = 100
const myArticlePrice = 100000000000000000n // 0.1 ether
const URI = "http://whatever/"
const purchases = [30, 40]

describe("TheSource", function () {

    /********************************************************************************
         ___ _     _                   
        | __(_)_ _| |_ _  _ _ _ ___ ___
        | _|| \ \ /  _| || | '_/ -_|_-<
        |_| |_/_\_\\__|\_,_|_| \___/__/
    
    ********************************************************************************/
    /* Marketplace deployment */
    async function deployMarketPlaceFixture() {
        const [owner, ...otherAccount] = await ethers.getSigners();
        const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
        const theSourceMarketPlace: TheSourceMarketPlace = await TheSourceMarketPlace.deploy();
        await theSourceMarketPlace.deployed();
        return { theSourceMarketPlace, owner, otherAccount }
    }

    /* MemberToken deployment */
    async function deployMemberTokenFixture() {
        const { theSourceMarketPlace, owner, otherAccount } = await loadFixture(deployMarketPlaceFixture);
        const TheSourceMemberToken = await ethers.getContractFactory("TheSourceMemberToken");
        const theSourceMemberToken: TheSourceMemberToken = await TheSourceMemberToken.deploy(
            theSourceMarketPlace.address,
            ROYALTIES);
        await theSourceMemberToken.deployed();
        return { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount }
    }

    /* Article deployment */
    async function deployArticleFixture() {
        const { theSourceMarketPlace, owner, otherAccount } = await loadFixture(deployMarketPlaceFixture);
        const TheSourceArticle = await ethers.getContractFactory("TheSourceArticle");
        const theSourceArticle: TheSourceArticle = await TheSourceArticle.deploy(
            theSourceMarketPlace.address,
            ROYALTIES
        );
        await theSourceArticle.deployed();
        return { theSourceMarketPlace, theSourceArticle, owner, otherAccount }
    }

    /* Article deployment */
    async function initialFixture() {
        // Deplopy MarketPlace
        const [owner, ...otherAccount] = await ethers.getSigners();
        const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
        const theSourceMarketPlace: TheSourceMarketPlace = await TheSourceMarketPlace.deploy();
        await theSourceMarketPlace.deployed();

        // Deplopy MemberToken
        const TheSourceMemberToken = await ethers.getContractFactory("TheSourceMemberToken");
        const theSourceMemberToken: TheSourceMemberToken = await TheSourceMemberToken.deploy(
            theSourceMarketPlace.address,
            ROYALTIES);
        await theSourceMemberToken.deployed();

        // Deploy Article
        const TheSourceArticle = await ethers.getContractFactory("TheSourceArticle");
        const theSourceArticle: TheSourceArticle = await TheSourceArticle.deploy(
            theSourceMarketPlace.address,
            ROYALTIES
        );
        await theSourceArticle.deployed();

        // Init MarketPlace
        await theSourceMarketPlace
            .connect(owner)
            .init(
                theSourceMemberToken.address,
                MEMBER_TOKEN_PRICE,
                theSourceArticle.address,
                MINT_ARTICLE_PRICE
            )
        await theSourceMarketPlace
            .connect(owner)
            .setBaseURIMemberToken(BASE_URI_MEMBERTOKEN)
        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount }
    }

    async function readyToEditArticleFixture() {
        const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount: allAccount } = await loadFixture(initialFixture);
        const [user, ...otherAccount] = allAccount;
        await theSourceMarketPlace.connect(user).buyMemberToken({ value: MEMBER_TOKEN_PRICE })
        const cashFlow = MEMBER_TOKEN_PRICE
        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount, cashFlow }
    }

    async function readyToBuyArticleFixture() {
        const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user: journalist, otherAccount: allAccount, cashFlow: initCashFlow } = await loadFixture(readyToEditArticleFixture);
        const [seller, ...otherAccount] = allAccount;
        const data = await theSourceMarketPlace.connect(journalist).mintArticle(
            memberTokenId, title, description, authorName, supply, myArticlePrice, URI,
            { value: MINT_ARTICLE_PRICE })
        const cashFlow = initCashFlow + MINT_ARTICLE_PRICE
        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount, cashFlow }
    }
    async function completeFixture() {
        const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller: seller1, otherAccount, cashFlow: initCashFlow } = await loadFixture(readyToBuyArticleFixture);
        const seller2 = otherAccount[0]
        let cashFlow = initCashFlow
        for (let qty of purchases) {
            await theSourceMarketPlace.connect(seller1).buyArticle(1, 30, { value: myArticlePrice * BigInt(qty) })
            cashFlow += myArticlePrice * BigInt(qty)
        }
        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow }
    }


    /********************************************************************************
         ___      _ _   _      _ _          _   _          
        |_ _|_ _ (_) |_(_)__ _| (_)___ __ _| |_(_)___ _ _  
         | || ' \| |  _| / _` | | (_-</ _` |  _| / _ \ ' \ 
        |___|_||_|_|\__|_\__,_|_|_/__/\__,_|\__|_\___/_||_|
    
    ********************************************************************************/

    describe("INITIALISATION", function () {
        describe("TheSourceMarketPlace deployment", function () {
            it("...should have an address ", async function () {
                const { theSourceMarketPlace } = await loadFixture(deployMarketPlaceFixture);
                expect(theSourceMarketPlace?.address).to.be.a('string');
            })
        });

        describe("TheSourceMemberToken deployment", function () {
            it("...should have the good owner ", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(deployMemberTokenFixture);
                const contractOwner = await theSourceMemberToken.owner()
                expect(contractOwner).to.equal(theSourceMarketPlace.address)
            })

            it("...should have the good royalties value ", async function () {
                const { theSourceMemberToken } = await loadFixture(deployMemberTokenFixture);
                expect(await theSourceMemberToken.royalties()).to.equal(ROYALTIES)
            })
        });

        describe("TheSourceArticle deployment", function () {
            it("...should have the good owner ", async function () {
                const { theSourceArticle, theSourceMarketPlace } = await loadFixture(deployArticleFixture);
                const contractOwner = await theSourceArticle.owner()
                expect(contractOwner).to.equal(theSourceMarketPlace.address)
            })

            it("...should have the good royalties value ", async function () {
                const { theSourceArticle } = await loadFixture(deployArticleFixture);
                expect(await theSourceArticle.royalties()).to.equal(ROYALTIES)
            })
        });

        describe("TheSourceMarketPlace initialization", function () {
            it("...should be initialized ", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner } = await loadFixture(deployMemberTokenFixture);
                const { theSourceArticle } = await loadFixture(deployArticleFixture);
                const tx = await theSourceMarketPlace
                    .connect(owner)
                    .init(
                        theSourceMemberToken.address,
                        MEMBER_TOKEN_PRICE,
                        theSourceArticle.address,
                        MINT_ARTICLE_PRICE
                    )
                await tx.wait(1);
                expect(tx.hash).to.be.a('string');
                expect(tx.blockNumber).to.not.be.null;
            })
            it("...shouldn't be initialized by a other contract", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, otherAccount } = await loadFixture(deployMemberTokenFixture);
                const { theSourceArticle } = await loadFixture(deployArticleFixture);
                await expect(
                    theSourceMarketPlace
                        .connect(otherAccount[0])
                        .init(
                            theSourceMemberToken.address,
                            MEMBER_TOKEN_PRICE,
                            theSourceArticle.address,
                            MINT_ARTICLE_PRICE
                        ))
                    .to.be.revertedWith("Ownable: caller is not the owner")
            })
        })
    })

    /********************************************************************************
          __  __           _              _____    _            
         |  \/  |___ _ __ | |__ _ _ ___  |_   _|__| |_____ _ _  
         | |\/| / -_) '  \| '_ \ '_/ -_)   | |/ _ \ / / -_) ' \ 
         |_|  |_\___|_|_|_|_.__/_| \___|   |_|\___/_\_\___|_||_|
    
    ********************************************************************************/

    describe("MemberTOKEN", async function () {
        describe("Price of MemberToken", async function () {
            const NEWMEMBERPRICE = 100;
            it("...should get the Price of Token by a user", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]
                expect(await theSourceMarketPlace.connect(user).getMemberTokenPrice()).to.equal(MEMBER_TOKEN_PRICE)
            })
            it("...should modify the Price of Token by owner", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                await expect(theSourceMarketPlace.setMemberTokenPrice(NEWMEMBERPRICE))
                    .to.emit(theSourceMarketPlace, "membershipPrice").withArgs(NEWMEMBERPRICE)
            })
            it("...shouldn't modify the Price of Token by a user", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0];
                await expect(theSourceMarketPlace.connect(user).setMemberTokenPrice(NEWMEMBERPRICE))
                    .to.be.revertedWith("Ownable: caller is not the owner");
            });
        })

        describe("Mint a MemberToken", async function () {
            it("...should pay a mint of a Member Token by a user", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]

                await expect(theSourceMarketPlace.connect(user).buyMemberToken({ value: MEMBER_TOKEN_PRICE }))
                    .to.emit(theSourceMemberToken, "Transfer").withArgs(ethers.constants.AddressZero, user.address, 1)
            });

            it("...should mint a Member Token outside the MarketPlace", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]

                await expect(theSourceMemberToken.connect(user).safeMint(user.address))
                    .to.be.revertedWith("Ownable: caller is not the owner")
            });

            it("...should increment tokenId", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]
                const oldIdToken = await theSourceMemberToken.getNumberOfMemberToken()
                await theSourceMarketPlace.connect(user).buyMemberToken({ value: MEMBER_TOKEN_PRICE })
                expect((await theSourceMemberToken.getNumberOfMemberToken()).sub(1)).to.equal(oldIdToken)
            });

            it("...should get the good URI after minning", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]
                await theSourceMarketPlace.connect(user).buyMemberToken({ value: MEMBER_TOKEN_PRICE })
                const tokenId = 1
                expect(await theSourceMemberToken.tokenURI(tokenId)).to.equal(`${BASE_URI_MEMBERTOKEN}${tokenId}.json`)
            });

            it("...should reject for a mint of a Member Token by a stingy user ", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]

                await expect(theSourceMarketPlace.connect(user).buyMemberToken({ value: (MEMBER_TOKEN_PRICE - 1000n) }))
                    .to.be.revertedWith("Not enough")
            });

            it("...should update states after a success mint", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]
                await expect(theSourceMarketPlace.connect(user).buyMemberToken({ value: MEMBER_TOKEN_PRICE }))
                    .to.emit(theSourceMemberToken, "Transfer").withArgs(ethers.constants.AddressZero, user.address, 1)

                expect(await theSourceMarketPlace.connect(user).balanceOfMemberToken()).to.equal(1)
                expect(await theSourceMemberToken.getNumberOfMemberToken()).to.equal(1);
                expect(await theSourceMemberToken.ownerOf(1)).to.equal(otherAccount[0].address);
            });
        })
    })
    /********************************************************************************
            _       _   _    _     
           /_\  _ _| |_(_)__| |___ 
          / _ \| '_|  _| / _| / -_)
         /_/ \_\_|  \__|_\__|_\___|

    ********************************************************************************/
    describe("Article", async function () {


        describe("Price of Article mint", async function () {
            const NEWARTICLEPRICE = 100;
            it("...should get the Price of Token by a user", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)
                expect(await theSourceMarketPlace.connect(user).getArticlePrice()).to.equal(MEMBER_TOKEN_PRICE)
            })
            it("...should modify the Price of Token by owner", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)
                await expect(theSourceMarketPlace.connect(owner).setArticlePrice(NEWARTICLEPRICE))
                    .to.emit(theSourceMarketPlace, "newArticlePrice").withArgs(NEWARTICLEPRICE)
            })
            it("...shouldn't modify the Price of Token by a user", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)
                await expect(theSourceMarketPlace.connect(user).setArticlePrice(NEWARTICLEPRICE))
                    .to.be.revertedWith("Ownable: caller is not the owner");
            });
        })

        describe("Mint a Article", async function () {
            it("...should pay a mint of a Article by a member", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await expect(theSourceMarketPlace.connect(user).mintArticle(
                    memberTokenId, title, description, authorName, supply, myArticlePrice, URI,
                    { value: MINT_ARTICLE_PRICE }
                ))
                    .to.emit(theSourceArticle, "TransferSingle").withArgs(theSourceMarketPlace.address, ethers.constants.AddressZero, user.address, 1, supply)
            });
            it("...should mint a Member Token outside the MarketPlace", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await expect(theSourceArticle.connect(user).safeMint(
                title, description, authorName, user.address, supply, myArticlePrice, URI,
                ))
                    .to.be.revertedWith("Ownable: caller is not the owner")
            });

            it("...should reject for a mint of a Article by a no-member ", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await expect(theSourceMarketPlace.connect(otherAccount[0]).mintArticle(
                    memberTokenId, title, description, authorName, supply, myArticlePrice, URI,
                    { value: MINT_ARTICLE_PRICE }
                ))
                    .to.be.revertedWith("Don't have access, buy or change MemberToken")
            });
            it("...should reject for a mint of a Article by a stingy member ", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await expect(theSourceMarketPlace.connect(user).mintArticle(
                    memberTokenId, title, description, authorName, supply, myArticlePrice, URI,
                    { value: MINT_ARTICLE_PRICE - 1000n }
                ))
                    .to.be.revertedWith("Not enough")
            });

            it("...should update states after a success mint", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await theSourceMarketPlace.connect(user).mintArticle(
                    memberTokenId, title, description, authorName, supply, myArticlePrice, URI,
                    { value: MINT_ARTICLE_PRICE })

                assert.isOk(await theSourceArticle.getArticle(1), "Nothing in return");
                const [mySupply, myPrice, authorAddress] = await theSourceArticle.getArticleInfos(1);
                expect(mySupply).to.equal(supply)
                expect(myPrice).to.equal(myArticlePrice)
                expect(await theSourceArticle.getNumberOfArticles()).to.equal(1);
            });


            it("...should reduice description if too long", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await theSourceMarketPlace.connect(user).mintArticle(
                    memberTokenId, title, "STARTBlablablablablablablablablablablablablaEND", authorName, supply, myArticlePrice, URI,
                    { value: MINT_ARTICLE_PRICE }
                )
                const result = await theSourceArticle.getArticle(1)
                expect(result[1].slice(-3)).to.equal("...")
            });
        })

        describe("Buy a Article", async function () {
            const idArticle = 1
            const qtyArticle = 1

            it("...should buy a Article", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)
                const [, price] = await theSourceArticle.getArticleInfos(idArticle);
                assert.isOk(await theSourceMarketPlace.connect(seller).buyArticle(idArticle, qtyArticle, { value: price }))
            })

            it("...shouldn't buy a inexistant Article", async function () {
                const wrongId = 3
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)
                const [supply, price, authorAddress] = await theSourceArticle.getArticleInfos(idArticle);

                await expect(theSourceMarketPlace.connect(seller).buyArticle(wrongId, qtyArticle, { value: price }))
                    .to.be.revertedWith("Invalid index");
            })
            it("...shouldn't buy the 0 Article", async function () {
                const wrongId = 0
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)
                const [supply, price, authorAddress] = await theSourceArticle.getArticleInfos(idArticle);

                await expect(theSourceMarketPlace.connect(seller).buyArticle(wrongId, qtyArticle, { value: price }))
                    .to.be.revertedWith("Invalid index");
            })

            it("...shouldn't buy a Article if he don't pay enough", async function () {
                const wrongPayment = 1
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)
                const [supply, price, authorAddress] = await theSourceArticle.getArticleInfos(idArticle);

                await expect(theSourceMarketPlace.connect(seller).buyArticle(idArticle, qtyArticle, { value: wrongPayment }))
                    .to.be.revertedWith("Not enough");
            })

            it("...shouldn't buy a Article if he want to many items", async function () {
                const qt = 1000
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)

                await expect(theSourceMarketPlace.connect(seller).buyArticle(idArticle, qtyArticle * 1000, { value: myArticlePrice * 1000n }))
                    .to.be.revertedWith("Not enough supply");
            })
            it("...shouldn't access to a inexistant Article", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)
                const actualId = await theSourceArticle.getNumberOfArticles()
                await expect(theSourceArticle.getArticle(0)).to.be.revertedWith("Invalid index");
                await expect(theSourceArticle.getArticleInfos(0)).to.be.revertedWith("Invalid index");
                await expect(theSourceArticle.getArticle(actualId.add(1))).to.be.revertedWith("Invalid index");
                await expect(theSourceArticle.getArticleInfos(actualId.add(1))).to.be.revertedWith("Invalid index");
            })


        })
    })



    /********************************************************************************
          ___       _                     
         | _ ) __ _| |__ _ _ _  __ ___ ___
         | _ \/ _` | / _` | ' \/ _/ -_|_-<
         |___/\__,_|_\__,_|_||_\__\___/__/

    ********************************************************************************/
    describe("Balances", async function () {
        const qty = purchases.reduce((a, b) => a + b, 0)
        const articleReceipt = BigInt(qty) * myArticlePrice
        const ownerReceipt = MINT_ARTICLE_PRICE + MEMBER_TOKEN_PRICE + articleReceipt * BigInt(ROYALTIES) / 1000n
        const journalisteReceipt = articleReceipt * BigInt((1000 - ROYALTIES)) / 1000n
        const WITHDRAW_VALUE = 500000000000000000n

        describe("Eth balances", async function () {
            it("...should have the good eth balance on every smart contract", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                expect(await ethers.provider.getBalance(theSourceMarketPlace.address)).to.equal(cashFlow)
                expect(await ethers.provider.getBalance(theSourceArticle.address)).to.equal(0n)
                expect(await ethers.provider.getBalance(theSourceMemberToken.address)).to.equal(0n)
            })


            it("...should withdraw amount", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                assert.isOk(await theSourceMarketPlace.connect(owner).withdraw(WITHDRAW_VALUE))
            })

            it("...should withdraw amount and have good contract balance", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                const oldBalance = await ethers.provider.getBalance(theSourceMarketPlace.address)
                assert.isOk(await theSourceMarketPlace.connect(owner).withdraw(WITHDRAW_VALUE))
                const newBalance = await ethers.provider.getBalance(theSourceMarketPlace.address)
                expect(newBalance.add(WITHDRAW_VALUE)).to.equal(oldBalance)
            })

            it("...should withdraw amount and have good owner balance", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                const oldBalance = await ethers.provider.getBalance(owner.address)
                const gasPrice = await ethers.provider.getGasPrice();
                const gasLimit = 500000;
                const overrides = {
                    gasPrice: gasPrice,
                    gasLimit: gasLimit
                };
                const tx = await theSourceMarketPlace.connect(owner).withdraw(WITHDRAW_VALUE, overrides)
                const receipt = await tx.wait()
                const gasUsed = receipt.gasUsed.mul(gasPrice)
                const newBalance = await ethers.provider.getBalance(owner.address)
                expect(newBalance.sub(oldBalance).add(gasUsed)).to.equal(WITHDRAW_VALUE)
            })

            it("...should upgrade balance on receipt coin", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                const oldBalance = await ethers.provider.getBalance(theSourceMarketPlace.address)
                assert.isOk(await seller2.sendTransaction({ to : theSourceMarketPlace.address, value : MEMBER_TOKEN_PRICE}))
                expect(await ethers.provider.getBalance(theSourceMarketPlace.address)).to.equal(oldBalance.add(MEMBER_TOKEN_PRICE))
            })
            it("...shouldn't withdraw 0", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                
                await expect(theSourceMarketPlace.connect(owner).withdraw(0))
                    .to.be.revertedWith("Amount must be greater than zero");
            })
            it("...shouldn't withdraw more than it has", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                
                await expect(theSourceMarketPlace.connect(seller2).withdraw(WITHDRAW_VALUE))
                    .to.be.revertedWith("Insufficient balance in contract");
            })
        })

        describe("Contract balances", async function () {
            it("...should have the good balance in MarketPlace", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                expect(await theSourceMarketPlace.connect(owner).balanceOf(owner.address)).to.equal(ownerReceipt)
                expect(await theSourceMarketPlace.connect(journalist).myBalance()).to.equal(journalisteReceipt)
            })
            it("...should transfer Ownership if there's the owner", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                assert.isOk(await theSourceMarketPlace.connect(owner).transferOwnership(seller2.address))
            })
            it("...shouldn't transfer Ownership if there isn't the owner", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                await expect(theSourceMarketPlace.connect(journalist).transferOwnership(seller2.address))
                    .to.rejectedWith("Ownable: caller is not the owner")
            })
            it("...should transfer Ownership and have good balances", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                const oldBalanceOwner = await theSourceMarketPlace.connect(owner).myBalance()
                const oldBalanceSeller2 = await theSourceMarketPlace.connect(seller2).myBalance()
                assert.isOk(await theSourceMarketPlace.connect(owner).transferOwnership(seller2.address))
                expect(await theSourceMarketPlace.connect(owner).myBalance()).to.equal(0n)
                expect(await theSourceMarketPlace.connect(seller2).myBalance()).to.equal(oldBalanceSeller2.add(oldBalanceOwner))
            })
            it("...should upgrade balance of owner on receipt coin", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller1, seller2, cashFlow } = await loadFixture(completeFixture)
                const oldBalance = await theSourceMarketPlace.connect(owner).myBalance()
                assert.isOk(await seller2.sendTransaction({ to : theSourceMarketPlace.address, value : MEMBER_TOKEN_PRICE}))
                expect(await theSourceMarketPlace.connect(owner).myBalance()).to.equal(oldBalance.add(MEMBER_TOKEN_PRICE))
            })
        })
    })
});

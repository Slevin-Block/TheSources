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

const ROYALTIES = 250000000000000000n;
const MemberTOKENPRICE = 250000000000000000n;
const MINTARTICLEPRICE = 250000000000000000n;
const BASE_URI_MEMBERTOKEN = "https://gateway.pinata.cloud/ipfs/QmQ41vE6evX9ysRiW3PJzf4UTeV5V6QTYcHCc6EcG3qtKa/"
const ADDR0 = "0x0000000000000000000000000000000000000000"
const memberTokenId = 1
const title = "Test";
const description = "My description"
const authorName = "My and myself"
const supply = 100
const price = 100000000000000000n // 0.1 ether
const URI = "http://whatever/"



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
            ROYALTIES,
            BASE_URI_MEMBERTOKEN);
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
            ROYALTIES,
            BASE_URI_MEMBERTOKEN);
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
                MemberTOKENPRICE,
                theSourceArticle.address,
                MINTARTICLEPRICE
            )

        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount }
    }

    async function readyToEditArticleFixture() {
        const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, otherAccount: allAccount } = await loadFixture(initialFixture);
        const [user, ...otherAccount] = allAccount;
        await theSourceMarketPlace.connect(user).buyMemberToken({ value: MemberTOKENPRICE })
        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount }
    }

    async function readyToBuyArticleFixture() {
        const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user: journalist, otherAccount: allAccount } = await loadFixture(readyToEditArticleFixture);
        const [seller, ...otherAccount] = allAccount;
        theSourceMarketPlace.connect(journalist).mintArticle(
                    memberTokenId, title, description, authorName, supply, price, URI,
                    { value: MINTARTICLEPRICE })

        return { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount }
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
                console.log("theSourceMarketPlace : ", theSourceMarketPlace.address)
                expect(theSourceMarketPlace?.address).to.be.a('string');
            })
        });

        describe("TheSourceMemberToken deployment", function () {
            it("...should have the good owner ", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(deployMemberTokenFixture);
                const contractOwner = await theSourceMemberToken.owner()
                console.log("theSourceMemberToken : ", theSourceMemberToken.address)
                expect(contractOwner).to.equal(theSourceMarketPlace.address)
            })

            it("...should have the good royalties value ", async function () {
                const { theSourceMemberToken } = await loadFixture(deployMemberTokenFixture);
                expect(await theSourceMemberToken.royalties()).to.equal(ROYALTIES)
            })

            /* Testing Base URI after token mint */
        });

        describe("TheSourceArticle deployment", function () {
            it("...should have the good owner ", async function () {
                const { theSourceArticle, theSourceMarketPlace } = await loadFixture(deployArticleFixture);
                const contractOwner = await theSourceArticle.owner()
                console.log("theSourceArticle : ", theSourceArticle.address)
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
                        MemberTOKENPRICE,
                        theSourceArticle.address,
                        MINTARTICLEPRICE
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
                            MemberTOKENPRICE,
                            theSourceArticle.address,
                            MINTARTICLEPRICE
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
                expect(await theSourceMarketPlace.connect(user).getMemberTokenPrice()).to.equal(MemberTOKENPRICE)
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

                await expect(theSourceMarketPlace.connect(user).buyMemberToken({ value: MemberTOKENPRICE }))
                    .to.emit(theSourceMemberToken, "Transfer").withArgs(ethers.constants.AddressZero, user.address, 1)
            });

            it("...should reject for a mint of a Member Token by a stingy user ", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]

                await expect(theSourceMarketPlace.connect(user).buyMemberToken({ value: (MemberTOKENPRICE - 1000n) }))
                    .to.be.revertedWith("Not enough")
            });

            it("...should update states after a success mint", async function () {
                const { theSourceMarketPlace, theSourceMemberToken, owner, otherAccount } = await loadFixture(initialFixture);
                const user = otherAccount[0]
                await expect(theSourceMarketPlace.connect(user).buyMemberToken({ value: MemberTOKENPRICE }))
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
                expect(await theSourceMarketPlace.connect(user).getArticlePrice()).to.equal(MemberTOKENPRICE)
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
                    memberTokenId, title, description, authorName, supply, price, URI,
                    { value: MINTARTICLEPRICE }
                ))
                    .to.emit(theSourceArticle, "TransferSingle").withArgs(theSourceMarketPlace.address, ethers.constants.AddressZero, user.address, 1, supply)
            });

            it("...should reject for a mint of a Article by a no-member ", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await expect(theSourceMarketPlace.connect(otherAccount[0]).mintArticle(
                    memberTokenId, title, description, authorName, supply, price, URI,
                    { value: MINTARTICLEPRICE }
                ))
                    .to.be.revertedWith("Don't have access, buy or change MemberToken")
            });
            it("...should reject for a mint of a Article by a stingy member ", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await expect(theSourceMarketPlace.connect(user).mintArticle(
                    memberTokenId, title, description, authorName, supply, price, URI,
                    { value: MINTARTICLEPRICE - 1000n }
                ))
                    .to.be.revertedWith("Not enough")
            });

            it("...should update states after a success mint", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, user, otherAccount } = await loadFixture(readyToEditArticleFixture)

                await theSourceMarketPlace.connect(user).mintArticle(
                    memberTokenId, title, description, authorName, supply, price, URI,
                    { value: MINTARTICLEPRICE })

                assert.isOk(await theSourceArticle.getArticle(1), "Nothing in return");
                const [mySupply, myPrice] = await theSourceArticle.getArticleStockandPrice(1);
                expect(mySupply).to.equal(supply)
                expect(myPrice).to.equal(price)
                expect(await theSourceArticle.getNumberOfArticles()).to.equal(1);
            });
        })

        describe("Buy a Article", async function () {
            it("...should buy a Article", async function () {
                const { theSourceMarketPlace, theSourceArticle, theSourceMemberToken, owner, journalist, seller, otherAccount } = await loadFixture(readyToBuyArticleFixture)
                await theSourceMarketPlace.connect(seller).buyArticle(1,3,)
            })
        })
    })

});

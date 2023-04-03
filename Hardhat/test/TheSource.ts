import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../typechain-types/contracts/TheSourceMarketPlace"
import { TheSourceMembreToken } from "../typechain-types/contracts/TheSourceMembreToken.sol/TheSourceMembreToken"
import { TheSourceArticle } from "../typechain-types/contracts/TheSourceArticle.sol/TheSourceArticle"

const ROYALTIES = 250; // in Finney
const BASE_URI_MEMBERTOKEN = "https://gateway.pinata.cloud/ipfs/QmQ41vE6evX9ysRiW3PJzf4UTeV5V6QTYcHCc6EcG3qtKa/"

describe("TheSourceMarketPlace", function () {

    /* Marketplace deployment */
    async function deployMarketPlaceFixture() {
        const [owner, ...otherAccount] = await ethers.getSigners();
        const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
        const theSourceMarketPlace  : TheSourceMarketPlace = await TheSourceMarketPlace.deploy();
        await theSourceMarketPlace.deployed();
        return {theSourceMarketPlace, owner, otherAccount}
    }

    describe("TheSourceMembreToken deployment", function () {
        async function deployMembreTokenFixture() {
        const { theSourceMarketPlace, owner, otherAccount } = await loadFixture(deployMarketPlaceFixture);
        const TheSourceMembreToken = await ethers.getContractFactory("TheSourceMembreToken");
        const theSourceMembreToken : TheSourceMembreToken = await TheSourceMembreToken.deploy(
                theSourceMarketPlace.address,
                ROYALTIES,
                BASE_URI_MEMBERTOKEN);
        await theSourceMembreToken.deployed();
        return {theSourceMarketPlace, theSourceMembreToken, owner, otherAccount}
    }
        

        it("...should have the good owner ", async function () {
            const {theSourceMarketPlace, theSourceMembreToken, owner, otherAccount} = await loadFixture(deployMembreTokenFixture);
            const contractOwner = await theSourceMembreToken.owner()
            expect( contractOwner).to.equal(theSourceMarketPlace.address)
        })

        it("...should have the royalties value ", async function () {
            const {theSourceMembreToken} = await loadFixture(deployMembreTokenFixture);
            expect( await theSourceMembreToken.royalties()).to.equal(ROYALTIES)
        })

    });
});

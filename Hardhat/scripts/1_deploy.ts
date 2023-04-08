import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../typeschain-types";
import fs from 'fs'

const path = "../Front/src/artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json";
const ROYALTIES = 250000000000000000n;
const MEMBERTOKENPRICE = 250000000000000000n;
const MINTARTICLEPRICE = 250000000000000000n;
let blocknumber

async function main() {

    // INITIALISATION
    const [owner, journalist, seller, ...otherAccounts] = await ethers.getSigners();
    console.log('Owner : ', owner.address)
    console.log('Journalist : ', journalist.address)
    //console.log([owner.address, ...otherAccounts.map(account => account.address)])

    // MARKET PLACE DEPLOYEMENT
    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");

    let theSourceMarketPlace: TheSourceMarketPlace
    theSourceMarketPlace = await TheSourceMarketPlace.deploy();
    await theSourceMarketPlace.deployed();
    blocknumber = theSourceMarketPlace.deployTransaction.blockNumber
    console.log(" ")
    console.log("---------------------------------------------------------------------")
    console.log(" ")
    console.log(`TheSourceMarketPlace has been deployed to address ${theSourceMarketPlace.address}`)
    console.log("BlockNumber : ", blocknumber)
    console.log(" ")
    console.log("---------------------------------------------------------------------")
    console.log(" ")


    // MEMBER TOKEN DEPLOYEMENT
    const TheSourceMemberToken = await ethers.getContractFactory("TheSourceMemberToken");
    const theSourceMemberToken = await TheSourceMemberToken.deploy(
        theSourceMarketPlace.address,
        ROYALTIES
    );
    await theSourceMemberToken.deployed();
    console.log(`TheSourceMemberToken has been deployed to address ${theSourceMemberToken.address}`)

    // ARTICLE DEPLOYEMENT
    const TheSourceArticle = await ethers.getContractFactory("TheSourceArticle");
    const theSourceArticle = await TheSourceArticle.deploy(
        theSourceMarketPlace.address,
        ROYALTIES
    );
    await theSourceMemberToken.deployed();
    console.log(`TheSourceArticle has been deployed to address ${theSourceArticle.address}`)

    // INITIALISATION MARKET PLACE

    await theSourceMarketPlace
        .connect(owner)
        .init(
            theSourceMemberToken.address,
            MEMBERTOKENPRICE,
            theSourceArticle.address,
            MINTARTICLEPRICE
        )
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



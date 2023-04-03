import { ethers } from "hardhat";
import fs from 'fs'


const ROYALTIES = 250000000000000000n;
const BEMemberPRICE = 250000000000000000n;
const MINTARTICLEPRICE = 250000000000000000n;
const BASE_URI_MEMBERTOKEN = "https://gateway.pinata.cloud/ipfs/QmQ41vE6evX9ysRiW3PJzf4UTeV5V6QTYcHCc6EcG3qtKa/"

async function main() {

    // INITIALISATION
    const [owner, ...otherAccounts] = await ethers.getSigners();
    //console.log([owner.address, ...otherAccounts.map(account => account.address)])

    // MARKET PLACE DEPLOYEMENT
    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    const theSourceMarketPlace = await TheSourceMarketPlace.deploy();
    await theSourceMarketPlace.deployed();
    console.log(`TheSourceMarketPlace has been deployed to address ${theSourceMarketPlace.address}`)


    // MEMBER TOKEN DEPLOYEMENT
    const TheSourceMemberToken = await ethers.getContractFactory("TheSourceMemberToken");
    const theSourceMemberToken = await TheSourceMemberToken.deploy(
        theSourceMarketPlace.address,
        ROYALTIES,
        BASE_URI_MEMBERTOKEN
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
                BEMemberPRICE,
                theSourceArticle.address,
                MINTARTICLEPRICE
            )


    // MINT A MEMBER TOKEN
    await theSourceMarketPlace.connect(otherAccounts[0]).buyMemberToken({value : BEMemberPRICE})
    console.log("Price : ", await theSourceMarketPlace.connect(otherAccounts[0]).getMemberTokenPrice())
    console.log("Balance : ", await theSourceMarketPlace.connect(otherAccounts[0]).balanceOfMemberToken())
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

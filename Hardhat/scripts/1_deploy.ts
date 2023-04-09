import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../typeschain-types";
import fs from 'fs'

const path = "../Front/src/artifacts/contracts/TheSourceMarketPlace.sol/TheSourceMarketPlace.json";
const ROYALTIES = 250000000000000000n;
const MEMBERTOKENPRICE = 250000000000000000n;
const MINTARTICLEPRICE = 250000000000000000n;
let blocknumber : number = 0
const localTest = true

async function main() {

    // INITIALISATION
    const [owner, journalist, seller, ...otherAccounts] = await ethers.getSigners();
    console.log('Owner : ', owner.address)
    console.log('Journalist : ', journalist.address)
    //console.log([owner.address, ...otherAccounts.map(account => account.address)])

    console.log("MARKET PLACE DEPLOYEMENT")
    console.log("------------------------")
    console.log(" ")
    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    let theSourceMarketPlace: TheSourceMarketPlace
    theSourceMarketPlace = await TheSourceMarketPlace.deploy();
    await theSourceMarketPlace.deployed();
    !localTest && await theSourceMarketPlace.deployTransaction.wait(12)

    //try{ console.log("deployTransaction : ",theSourceMarketPlace.deployTransaction) }catch(err){console.log(err)}
    try{ console.log("hash : ", theSourceMarketPlace.deployTransaction.hash) }catch(err){console.log(err)}
    try{ console.log("blocknumber : ", theSourceMarketPlace.deployTransaction.blockNumber) }catch(err){console.log(err)}

    if (!!theSourceMarketPlace?.deployTransaction?.blockNumber) blocknumber = theSourceMarketPlace.deployTransaction.blockNumber
    console.log("Find blocknumber : ", !!blocknumber)
    if (!!blocknumber){
        const tx = await theSourceMarketPlace.setBlocknumber(blocknumber)
        !localTest && tx.wait(6)
    }

    console.log(" ")
    console.log("---------------------------------------------------------------------")
    console.log(" ")
    console.log(`TheSourceMarketPlace has been deployed to address ${theSourceMarketPlace.address}`)
    console.log("BlockNumber : ", await theSourceMarketPlace.blocknumber())
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
    !localTest && await theSourceMemberToken.deployTransaction.wait(6)
    console.log(`TheSourceMemberToken has been deployed to address ${theSourceMemberToken.address}`)



    // ARTICLE DEPLOYEMENT
    const TheSourceArticle = await ethers.getContractFactory("TheSourceArticle");
    const theSourceArticle = await TheSourceArticle.deploy(
        theSourceMarketPlace.address,
        ROYALTIES
    );
    await theSourceArticle.deployed();
    !localTest && await theSourceArticle.deployTransaction.wait(6)
    console.log(`TheSourceArticle has been deployed to address ${theSourceArticle.address}`)



    // INITIALISATION MARKET PLACE
    console.log("MarketPlace initialisation ...")
    console.log("with : ", theSourceMemberToken.address, MEMBERTOKENPRICE, theSourceArticle.address, MINTARTICLEPRICE)
    const txInit = await theSourceMarketPlace
        .connect(owner)
        .init(
            theSourceMemberToken.address,
            MEMBERTOKENPRICE,
            theSourceArticle.address,
            MINTARTICLEPRICE
        )
    !localTest && await txInit.wait(6)
    console.log("...done !")
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



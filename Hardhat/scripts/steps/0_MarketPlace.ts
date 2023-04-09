import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../../typeschain-types";

let blocknumber : number | null = null

async function main() {

    const [owner, journalist, seller, ...otherAccounts] = await ethers.getSigners();
    console.log('Owner : ', owner.address)

    console.log("MARKET PLACE DEPLOYEMENT")
    console.log("------------------------")
    console.log(" ")
    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    let theSourceMarketPlace: TheSourceMarketPlace
    theSourceMarketPlace = await TheSourceMarketPlace.deploy();
    await theSourceMarketPlace.deployed();
    await theSourceMarketPlace.deployTransaction.wait(12)

    try{ console.log("deployTransaction : ",theSourceMarketPlace.deployTransaction) }catch(err){console.log(err)}
    try{ console.log("hash : ", theSourceMarketPlace.deployTransaction.hash) }catch(err){console.log(err)}
    try{ console.log("blocknumber : ", theSourceMarketPlace.deployTransaction.blockNumber) }catch(err){console.log(err)}

    if (!!theSourceMarketPlace?.deployTransaction?.blockNumber) blocknumber = theSourceMarketPlace.deployTransaction.blockNumber
    console.log("Find blocknumber : ",!!blocknumber)
    if (!!blocknumber){
        const tx = await theSourceMarketPlace.connect(owner).setBlocknumber(blocknumber)
        tx.wait(6)
    }

    console.log(" ")
    console.log("---------------------------------------------------------------------")
    console.log(" ")
    console.log(`TheSourceMarketPlace has been deployed to address ${theSourceMarketPlace.address}`)
    console.log("BlockNumber : ", await theSourceMarketPlace.blocknumber())
    console.log(" ")
    console.log("---------------------------------------------------------------------")
    console.log(" ")
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



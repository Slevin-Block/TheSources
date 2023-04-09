import { ethers } from "hardhat";
import { BigNumber } from 'ethers'
import { TheSourceMarketPlace } from "../typeschain-types";

let blocknumber : number | null= null

const URI_METADATA = 'QmctFYiKAVbEXXAAXJ3NbTv5Z2FnrHG8tfBazB7W3Mg7QD'
const BASE_URI_MEMBERTOKEN = `https://ipfs.io/ipfs/${URI_METADATA}/`
const initialMarketPlaceAddr = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0'

const localTest = true
const extraGasFee = 1
const unit = 'gwei'


async function main() {

    const [owner, ...otherAccounts] = await ethers.getSigners();

    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    let theSourceMarketPlace : TheSourceMarketPlace
    theSourceMarketPlace = TheSourceMarketPlace.attach(initialMarketPlaceAddr);

    console.log("--------- BASE URI ---------")
    const txBaseUri = await theSourceMarketPlace.connect(owner).setBaseURIMemberToken(BASE_URI_MEMBERTOKEN, {gasPrice: ethers.utils.parseUnits(extraGasFee.toString(), unit)})
    !localTest && txBaseUri.wait(6)
    console.log("...done")
    console.log(" ")

    if (blocknumber !== null){
        console.log("--------- BLOCKNUMBER ---------")
        const txBlocknumber = await theSourceMarketPlace.connect(owner).setBlocknumber(blocknumber,
        {gasPrice: ethers.utils.parseUnits(extraGasFee.toString(), unit)})
        !localTest && await txBlocknumber.wait(6)
        console.log("BlockNumber : ", await theSourceMarketPlace.blocknumber())
        console.log("...done")
        console.log(" ")
    }


    /* Mint un Member Token => pour connaitre sa baseURI */
    /* const MemberTokenPrice = await theSourceMarketPlace.connect(journalist).getMemberTokenPrice()
    await theSourceMarketPlace.connect(journalist).buyMemberToken({value : MemberTokenPrice})

    const TheSourceMemberToken = await ethers.getContractFactory("TheSourceMemberToken");
    const contractMemberTokenAddr = await theSourceMarketPlace.memberTokenContract()
    const theSourceMemberToken = TheSourceMemberToken.attach(contractMemberTokenAddr)

    // @ts-ignore
    const events = await theSourceMemberToken.queryFilter("Transfer");
    const tokenIds = events.map(event => event.args.tokenId.toNumber())
    console.log(await theSourceMemberToken.tokenURI(tokenIds.at(-1))) */
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
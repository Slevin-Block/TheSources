import { ethers } from "hardhat";
import { BigNumber } from 'ethers'
import { TheSourceMarketPlace } from "../typeschain-types";

const URI = 'Qma7GUvATq1jVyGb9Hyu6HP5XbyesqnevcXjgG2iTeZSbF'

const BASE_URI_MEMBERTOKEN = `https://ipfs.io/ipfs/${URI}/`
const initialMarketPlaceAddr = '0x0B306BF915C4d645ff596e518fAf3F9669b97016'


async function main() {

    const [owner, journalist, ...otherAccounts] = await ethers.getSigners();

    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    let theSourceMarketPlace : TheSourceMarketPlace
    theSourceMarketPlace = TheSourceMarketPlace.attach(initialMarketPlaceAddr);
    await theSourceMarketPlace.connect(owner).setBaseURIMemberToken(BASE_URI_MEMBERTOKEN)

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
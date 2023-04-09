import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../../typeschain-types";

const MEMBERTOKENPRICE = 250000000000000000n;
const MINTARTICLEPRICE = 250000000000000000n;

const initialMarketPlaceAddr = '0x4F7e9F38CE909709a7d1Ee24EcE5BE911C724E69'
const theSourceMemberToken = {address : "0x73050B6b44A2723A8184aFE289c01cd8ceE754f1"}
const theSourceArticle = { address : "0x7D6f23189416D1aAAC1129BD9Bb5484ef93a1067" }

async function main() {

    // INITIALISATION
    const [owner, ...otherAccounts] = await ethers.getSigners();
    console.log(owner)
    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    let theSourceMarketPlace : TheSourceMarketPlace
    theSourceMarketPlace = TheSourceMarketPlace.attach(initialMarketPlaceAddr);

    // INITIALISATION MARKET PLACE
    console.log("MarketPlace initialisation ...")
    console.log("with : ", theSourceMemberToken.address, MEMBERTOKENPRICE, theSourceArticle.address, MINTARTICLEPRICE)
    try{
        const txInit = await theSourceMarketPlace
            .connect(owner.address)
            .init(
                theSourceMemberToken.address,
                MEMBERTOKENPRICE,
                theSourceArticle.address,
                MINTARTICLEPRICE
            )
        await txInit.wait(6)
        console.log("...done !")
    }catch(err){console.log(err)}
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



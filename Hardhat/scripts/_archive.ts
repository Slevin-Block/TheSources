import { ethers } from "hardhat";
import { TheSourceMarketPlace } from "../typeschain-types";

const ROYALTIES = 250000000000000000n;
const BEMemberPRICE = 250000000000000000n;
const MINTARTICLEPRICE = 250000000000000000n;
const title = "Test";
const description = "My description"
const authorName = "My and myself"
const supply = 100
const price = 10000000000000000n // 0.01 ether
const URI = "http://whatever/"


const BASE_URI_MEMBERTOKEN = "https://gateway.pinata.cloud/ipfs/QmagrTn3yhhctmYou7WmMx61eQi47fDCVugZgtn59XEZHK/"
const initialMarketPlaceAddr = ''//'0x5FbDB2315678afecb367f032d93F642f64180aa3'

async function main() {

    // INITIALISATION
    const [owner, journalist, seller, ...otherAccounts] = await ethers.getSigners();
    console.log('Owner : ', owner.address)
    console.log('Journalist : ', journalist.address)
    //console.log([owner.address, ...otherAccounts.map(account => account.address)])

    // MARKET PLACE DEPLOYEMENT
    const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
    let theSourceMarketPlace : TheSourceMarketPlace
    if (initialMarketPlaceAddr){
        theSourceMarketPlace = await TheSourceMarketPlace.attach(initialMarketPlaceAddr);
    }else {
        theSourceMarketPlace = await TheSourceMarketPlace.deploy();
        await theSourceMarketPlace.deployed();
    }


    console.log(" ")
    console.log("---------------------------------------------------------------------")
    console.log(" ")
    console.log(`TheSourceMarketPlace has been deployed to address ${theSourceMarketPlace.address}`)
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
                BEMemberPRICE,
                theSourceArticle.address,
                MINTARTICLEPRICE
            )


    // MINT A MEMBER TOKEN
    await theSourceMarketPlace.connect(journalist).buyMemberToken({value : BEMemberPRICE})
    console.log("Price : ", await theSourceMarketPlace.connect(journalist).getMemberTokenPrice())
    console.log("Balance : ", await theSourceMarketPlace.connect(journalist).balanceOfMemberToken())


    // MINT A ARTICLE
    await theSourceMarketPlace.connect(journalist).mintArticle(
                    1, title, description, authorName, supply, price, URI,
                    { value: MINTARTICLEPRICE })

    console.log("INFOS ARTICLE : ", await theSourceArticle.getArticleInfos(1))


    const MT_journalist= await theSourceMarketPlace.connect(journalist).balanceOfMemberToken()
    const MT_owner= await theSourceMarketPlace.connect(owner).balanceOfMemberToken()

    console.log("Nombre de token de membre du journaliste : ", MT_journalist)
    console.log("Nombre de token de membre du owner : ", MT_owner)
    // BUY A ARTICLE

    await theSourceMarketPlace.connect(seller).buyArticle(1,1, {value : price})
    console.log("INFOS ARTICLE : ", await theSourceArticle.getArticleInfos(1))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

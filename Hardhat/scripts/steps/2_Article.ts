import { ethers } from "hardhat";

const ROYALTIES = 250000000000000000n;
const theSourceMarketPlace = { address : "0x4F7e9F38CE909709a7d1Ee24EcE5BE911C724E69" }

async function main() {

    // ARTICLE DEPLOYEMENT
    const TheSourceArticle = await ethers.getContractFactory("TheSourceArticle");
    const theSourceArticle = await TheSourceArticle.deploy(
        theSourceMarketPlace.address,
        ROYALTIES
    );
    await theSourceArticle.deployed();
    await theSourceArticle.deployTransaction.wait(6)
    console.log(`TheSourceArticle has been deployed to address ${theSourceArticle.address}`)
    console.log("hash : ", theSourceArticle.deployTransaction.hash)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



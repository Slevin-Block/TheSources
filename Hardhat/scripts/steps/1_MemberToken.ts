import { ethers } from "hardhat";

const ROYALTIES = 250000000000000000n;
const theSourceMarketPlace = { address : "0x4F7e9F38CE909709a7d1Ee24EcE5BE911C724E69" }

async function main() {

    // MEMBER TOKEN DEPLOYEMENT
    const TheSourceMemberToken = await ethers.getContractFactory("TheSourceMemberToken");
    const theSourceMemberToken = await TheSourceMemberToken.deploy(
        theSourceMarketPlace.address,
        ROYALTIES
    );
    await theSourceMemberToken.deployed();
    await theSourceMemberToken.deployTransaction.wait(6)
    console.log(`TheSourceMemberToken has been deployed to address ${theSourceMemberToken.address}`)
    console.log("hash : ", theSourceMemberToken.deployTransaction.hash)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});



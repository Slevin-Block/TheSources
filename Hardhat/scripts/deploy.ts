import { ethers } from "hardhat";

async function main() {

    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();

    await simpleStorage.deployed();

    console.log(
        `SimpleStorage has been deployed to address ${simpleStorage.address}`
    )

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

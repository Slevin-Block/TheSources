import { ethers } from "hardhat";

async function main() {
    const [owner, otherAccount] = await ethers.getSigners();
    console.log(otherAccount)
    const TheSourceMembreToken = await ethers.getContractFactory("TheSourceMembreToken");
    const theSourceMembreToken = await TheSourceMembreToken.deploy();
    await theSourceMembreToken.deployed();
    const membreToken = await ethers.getContractAt("TheSourceMembreToken", theSourceMembreToken.address);
    console.log(
        `TheSourceMembreToken has been deployed to address ${membreToken.address}`
    )
    const address_MemberToken = membreToken.address
    let theSourceMarketPlace
    if (address_MemberToken){
        const TheSourceMarketPlace = await ethers.getContractFactory("TheSourceMarketPlace");
        theSourceMarketPlace = await TheSourceMarketPlace.deploy(address_MemberToken);
        await theSourceMarketPlace.deployed();

        console.log(
            `TheSourceMarketPlace has been deployed to address ${theSourceMarketPlace.address}`
        )
    }else{
        throw console.log("Erreur deployement")
    }
    if(theSourceMarketPlace.address){
        await membreToken.transferOwnership(theSourceMarketPlace.address)
        const symb = await theSourceMarketPlace.getSymbol()
        console.log('Le symbole est : ', symb)

        //const tokenId = await theSourceMarketPlace.mintMemberToken({from :})

    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

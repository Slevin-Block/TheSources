import { ethers } from "hardhat";
import fs from 'fs'

async function main() {

    // INITIALISATION
    const [owner, ...clients] = await ethers.getSigners();
    console.log([owner.address, ...clients.map(account => account.address)])
    
    // MEMBRE TOKEN DEPLOYEMENT
    const baseURIMembreToken = "https://gateway.pinata.cloud/ipfs/QmQ41vE6evX9ysRiW3PJzf4UTeV5V6QTYcHCc6EcG3qtKa/"
    const TheSourceMembreToken = await ethers.getContractFactory("TheSourceMembreToken");
    const theSourceMembreToken = await TheSourceMembreToken.deploy();
    await theSourceMembreToken.deployed();
    const membreToken = await ethers.getContractAt("TheSourceMembreToken", theSourceMembreToken.address);
    const address_MemberToken = membreToken.address
    console.log( `TheSourceMembreToken has been deployed to address ${address_MemberToken}` )
    await membreToken.setBaseURI(baseURIMembreToken)
    
    fs.readdir('./Tokens/json', (err, files) => {
        if (err) return console.log(err)
        
    })


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

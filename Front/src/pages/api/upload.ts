// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage'

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from 'mime'

// The 'fs' builtin module on Node.js provides access to the file system
import fs from 'fs'

// The 'path' module provides helpers for manipulating filesystem paths
import path from 'path'

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY

async function storeNFT(imagePath, name, description) {
    // load the file from disk
    const image = await fileFromPath(imagePath)

    // create a new NFTStorage client using our API key
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })

    // call client.store, passing in the image & metadata
    return nftstorage.store({
        image,
        name,
        description,
    })
}

async function fileFromPath(filePath) {
    const content = await fs.promises.readFile(filePath)
    const type = mime.getType(filePath)
    return new File([content], path.basename(filePath), { type })
}

async function main() {
    const args = process.argv.slice(2)
    if (args.length !== 3) {
        console.error(`usage: ${process.argv[0]} ${process.argv[1]} <image-path> <name> <description>`)
        process.exit(1)
    }

    const [imagePath, name, description] = args
    const result = await storeNFT(imagePath, name, description)
    console.log(result)
}
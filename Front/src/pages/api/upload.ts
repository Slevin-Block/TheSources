import type { NextApiRequest, NextApiResponse } from 'next'
import ffs, { promises as fs } from "fs";
import path from "path";
import formidable, { File } from 'formidable';
import pinataSDK, { PinataPinOptions } from '@pinata/sdk'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions';
import { string } from 'yup';

export const config = {
    api: {
        bodyParser: false,
    }
};

interface Session {
    nonce?: string;
    siwe?: string;
}

type Response = { status: 'ok' | 'fail', message: string, cid?: string };

type ProcessedFiles = Array<[string, File]>;

type MetadataType = {
    name?: string;
    description?: string;
    image?: string;
    seller_fee_basis_points? : number;
    fee_recipient ? : string;
    attributes?: {
        trait_type: string;
        value: string;
    }[];
}

async function handler(req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    console.log('UPLOAD ...')
    const timestamp = Date.now()
    let status = 200;
    let resultBody: Response = { status: 'ok', message: 'Files were uploaded successfully' };
    const tempDir = '/tmp'; //path.join(process.cwd(), 'temp');

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm({ uploadDir: tempDir });
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => { });
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
    });

    if (files?.length) {
        let metadata: MetadataType = {}
        //Create directory for uploads
        const targetPath = `/tmp/uploads/${timestamp}/`;
        if (!ffs.existsSync(`/tmp/uploads/`)){
            try{
                await fs.mkdir(`/tmp/uploads/`);
            }catch(e){
                console.log(e)
            }
        }
        try {
            await fs.access(targetPath);
        } catch (e) {
            await fs.mkdir(targetPath);
        }

        //Move uploaded files to directory and store metadata object
        for (const file of files) {
            const tempPath = file[1].filepath;
            const targetFilePath = targetPath + file[1].originalFilename
            if (ffs.existsSync(tempPath)) {
                try { await fs.rename(tempPath, targetFilePath) }
                catch (err) { return res.status(404).send({ status: 'fail', message: 'Error rename' }) }
                try {
                    if (file[1].originalFilename === 'metadata.json') {
                        const result = await fs.readFile(targetFilePath, 'utf8')
                        metadata = JSON.parse(result)
                    }
                } catch (err) { return res.status(404).send({ status: 'fail', message: 'Error read Metadata' }) }
            } else {
                console.log('Missing file : ', targetFilePath)
            }
        }


        // Initialization Pinata pinning
        const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
        const folderOptions: PinataPinOptions = {
            pinataMetadata: { name: `${metadata.name} - folder` },
            pinataOptions: { cidVersion: 0 }
        };
        const metadataOptions: PinataPinOptions = {
            pinataMetadata: { name: `${metadata.name} - metadata` },
            pinataOptions: { cidVersion: 0 }
        };


        // Send Folder to Pinata for pinning
        try {
            // Send Folder and get back folder CID
            const response = await pinata.pinFromFS(targetPath, folderOptions)
            const folderCID = `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}`
            resultBody = { ...resultBody, cid: folderCID }

            // Upgrade Article metadata
            let coverName: string | undefined = ''
            if (metadata) coverName = metadata?.attributes?.find(field => field?.trait_type === 'Cover')?.value
            if (!coverName) return res.status(404).send({ status: 'fail', message: 'Error generate Metadata' })
            metadata = {
                ...metadata,
                image: `${folderCID}/${coverName}`,
                seller_fee_basis_points : 250, // Le rendre dynamique (appel du smart Contract de la Market place pour définir les royalities)
                fee_recipient : process.env.ADDRESS_MARKETPLACE,
            }
            if (metadata.attributes) {
                metadata.attributes.push({
                    trait_type: "CID",
                    value: folderCID
                })
            } else return res.status(404).send({ status: 'fail', message: 'Error read Metadata' })


            // Send Metadata and get back Article SFT CID
            try{
                const NFTcid = await pinata.pinJSONToIPFS(metadata, metadataOptions)
                cleanUp(files, targetPath)
                console.log('Metadata : ', metadata)
                console.log('CID : ',NFTcid.IpfsHash);
                return res.status(status).send({ status: 'ok', message: `successfull ${folderCID}`, cid: NFTcid.IpfsHash })
            }catch(err){
                return res.status(500).json({ status : 'fail', message: 'Error pinJSONToIPFS' });
            }

        } catch (err) {
            console.log('ERREUR PINATA : ', err)
            cleanUp(files, targetPath)
            res.status(status).json(resultBody)
        }
    } else {
        return res.status(status).send(resultBody);
    }

}

export default withIronSessionApiRoute(handler, ironOptions)

function cleanUp(files: ProcessedFiles, targetPath: string) {

    for (const file of files) {
        const tempPath = file[1].filepath;
        if (ffs.existsSync(tempPath)) {
            ffs.rm(tempPath, (err) => {
                if (err) console.log(err)
            })
        } else {
            console.log('Missing file : ', tempPath)
        }
    }
    fs.rm(targetPath, { recursive: true })
}


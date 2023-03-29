import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions'

import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import FormData from 'form-data';
import formidable, {File} from 'formidable';
import { NFTStorage } from 'nft.storage'
import got from "got"

interface Session {
    nonce?: string;
    siwe?: string;
}

export const config = {
    api: { bodyParser: false }
}

type ProcessedFiles = Array<[string, File]>


async function handler(req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully' };

    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm();
        const files: ProcessedFiles = [];
        form.on('file', function (field, file) {
            files.push([field, file]);
        })
        form.on('end', () => resolve(files));
        form.on('error', err => reject(err));
        form.parse(req, () => {
            //
        });
    }).catch(e => {
        console.log(e);
        status = 500;
        resultBody = { status: 'fail', message: 'Upload error' }
    });

    if (files?.length) {
        //@ts-ignore
        const metadataFile = files.find(file => file[1].name.includes('metadata.json'))
        if (metadataFile) {
            //@ts-ignore
            fs.readFile(metadataFile[1].path, 'utf8', (err, data) => {
                err && console.log(err)
                !err && console.log(JSON.parse(data))
            })
        }

        /* Add files to FormData */
        const body = new FormData();
        for (const file of files) {
            //@ts-ignore
            body.append(file[0], fs.createReadStream(file[1].path), {
                filepath: '/',
            });
        }
        /* Send request to another server */
        try {
            // TRY WITH NFT.STORAGE
            /* console.log('TEST WITH NFT.STORAGE ...')
            const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY || '' })
            const cid = await client.storeDirectory(files.map(file => file[1]))
            console.log(cid) */


            // TRY WITH PINATA FETCH
            console.log('TEST WITH PINATA ...')
            const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: "POST",
                headers: { "Authorization": `Bearer ${process.env.PINATA_JWT}` },
                body,
            })
            console.log('AFTER FETCH')
            const data = await response.json();
            console.log(data)

            // TRY WITH PINATA GOT
            /* const response = await got(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
                method: 'POST',
                headers: {
                    "Content-Type": `multipart/form-data; boundary=${body._boundary}`,
                    "Authorization": process.env.PINATA_JWT
                },
                body
            })
                .on('uploadProgress', progress => {
                    console.log(progress);
                });
            console.log(JSON.parse(response.body)); */

            return res.status(200).json({ status: 'ok', message: 'Youpi' });
        } catch (err) {
            console.log(err)
            return res.status(400).json({ status: 'fail', message: 'Echec, snif' });
        }
    }

    res.status(status).json(resultBody);
}

export default withIronSessionApiRoute(handler, ironOptions)

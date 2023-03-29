import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions'

import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs";
import FormData from 'form-data';
import formidable, { File } from 'formidable';
import axios from 'axios';

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
                !err && console.log(JSON.parse(data))
                err && console.log(err)
            })
        }

        /* Add files to FormData */
        const body = new FormData();
        for (const file of files) {
            //@ts-ignore
            body.append(file[0], fs.createReadStream(file[1].path), {
                filepath: 'test/',
            });
        }
        /* Send request to another server */
        try {
            const config = {
                method: "POST",
                maxContentLength: Infinity,
                headers: { "Authorization": `Bearer ${process.env.PINATA_JWT}` },
                body,
            };
            const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', config)
            const data = await response.json();
            // Do anything you need with response
            console.log(data)
            return res.status(200).json({ status: 'ok', message: 'Youpi' });
        } catch (err) {
            console.log(err)
            return res.status(400).json({ status: 'fail', message: 'Echec, snif' });
        }
    }

    res.status(status).json(resultBody);
}

export default withIronSessionApiRoute(handler, ironOptions)

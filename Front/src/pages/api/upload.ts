import type { NextApiRequest, NextApiResponse } from 'next'
import ffs, { promises as fs } from "fs";
import path from "path";
import formidable, { File } from 'formidable';
import pinataSDK from '@pinata/sdk'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions';

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

async function handler(req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    console.log('UPLOAD ...')
    const timestamp = Date.now()
    console.log(timestamp)
    const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
    let status = 200;
    let resultBody: Response = { status: 'ok', message: 'Files were uploaded successfully' };
    const tempDir = path.join(process.cwd(), 'temp');
    console.log(tempDir)
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

        //Create directory for uploads
        const targetPath = path.join(process.cwd(), `/uploads/${timestamp}/`);
        try {
            await fs.access(targetPath);
        } catch (e) {
            await fs.mkdir(targetPath);
        }

        //Move uploaded files to directory
        for (const file of files) {
            const tempPath = file[1].filepath;
            const targetFilePath = targetPath + file[1].originalFilename
            console.log(file[1].originalFilename)
            if (ffs.existsSync(tempPath)) {
                ffs.rename(tempPath, targetFilePath, (err) => {
                    if (err) console.log(err)

                })
            } else {
                console.log('Missing file : ', targetFilePath)
            }
        }
        console.log('TEST : ', targetPath)
        try {
            const response = await pinata.pinFromFS(targetPath)
            resultBody = { ...resultBody, cid: `https://gateway.pinata.cloud/ipfs/${response.IpfsHash}` }
            cleanUp(files, targetPath)
            res.status(status).json(resultBody)
        } catch (err) {
            console.log('ERREUR PINATA : ', err)
            cleanUp(files, targetPath)
            res.status(status).json(resultBody)
        }
    } else {
        res.status(status).json(resultBody);
    }

}

export default withIronSessionApiRoute(handler, ironOptions)

function cleanUp(files: ProcessedFiles, targetPath: string) {
    /* console.log("CleanUp") */
    for (const file of files) {
        const tempPath = file[1].filepath;
        if (ffs.existsSync(tempPath)) {
            ffs.rm(tempPath, (err) => {
                if (err) console.log(err)
            })
        }/*  else {
            console.log('Missing file : ', tempPath)
        } */
    }
    fs.rm(targetPath, { recursive: true })
}
import type { NextApiRequest, NextApiResponse } from 'next'
import { promises as fs } from "fs";
import ffs from 'fs-extra';
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

type ProcessedFiles = Array<[string, File]>;

async function handler(req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    const timestamp = Date.now()
    console.log(timestamp)
    const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
    let status = 200,
        resultBody = { status: 'ok', message: 'Files were uploaded successfully' };
    const tempDir = path.join(process.cwd(), 'temp');
    console.log(tempDir)
    await ffs.ensureDir(tempDir, { mode: 0o777 });
    /* Get files using formidable */
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm({
            uploadDir: tempDir,
        });
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
        resultBody = {
            status: 'fail', message: 'Upload error'
        }
    });

    if (files?.length) {

        /* Create directory for uploads */
        const targetPath = path.join(process.cwd(), `/uploads/${timestamp}/`);
        try {
            await fs.access(targetPath);
        } catch (e) {
            await fs.mkdir(targetPath);
        }

        /* Move uploaded files to directory */
        for (const file of files) {
            const tempPath = file[1].filepath;
            console.log(tempPath)
            const targetFilePath = targetPath + file[1].originalFilename
            await fs.copyFile(tempPath, targetFilePath);
            await fs.chmod(targetFilePath, 0o777); // Ajouter les permissions complètes pour tous les utilisateurs
            await fs.unlink(tempPath); // Supprimer le fichier original
        }
        console.log('TEST')
        pinata.pinFromFS(targetPath)
            .then(res => console.log(res))
            .then(() => fs.rmdir(targetPath, { recursive: true }))


    }

    res.status(status).json(resultBody);
}

export default withIronSessionApiRoute(handler, ironOptions)

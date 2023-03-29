import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions'

import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'
import { promises as fs } from 'fs';
import formidable, {File} from 'formidable';

import { NFTStorage } from 'nft.storage'
import pinataSDK, { PinataPinOptions } from '@pinata/sdk'
import axios from 'axios';
import { formErrorAnatomy } from '@chakra-ui/anatomy';

interface Session {
    nonce?: string;
    siwe?: string;
}

export const config = {
    api: { bodyParser: false }
}

type ProcessedFiles = Array<[string, File]>


async function handler(req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
        const form = new formidable.IncomingForm()
        const files : ProcessedFiles = [];
        form.on('file', function (field, file){
            files.push([field, file])
        })
        form.on('end', () => resolve(files))
        form.on('error', err => reject(err))
        form.parse(req, () => {/* console.log(req) */})
    }).catch(err => {
        console.log(err);
        return res.status(500).send({error : 'Upload error'})
    })

    if (files?.length){
        console.log('Nb files : ', files.length)
    }else{
        console.log('Nothing send')
    }
    return res.status(200).send({mesg : 'Files were upload successfully'})
}

export default withIronSessionApiRoute(handler, ironOptions)

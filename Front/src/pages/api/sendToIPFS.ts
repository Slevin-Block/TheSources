import pinataSDK, { PinataPinOptions } from '@pinata/sdk'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions'
import formidable, { Fields, Files, File } from 'formidable';
import fs from 'fs'


interface Session {
    nonce?: string;
    siwe?: string;
}



export const config = {
    api: {
        bodyParser: false
    }
}


interface Metadata {
    name: string;
    description?: string;
    attributes: {
        trait_type: string;
        value: string;
        address?: string;
    }[];
}

const sendToIPFS = async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err: any, fields: Fields, files: Files) => {
        console.log('Fields : ', fields)
        console.log('Files : ', files)
        /* if (err) {
            console.error('Error parsing form data', err);
            res.status(500).send('Error parsing form data');
            return;
        }
        
        const metadataFile = Array.isArray(files['MonTitre/metadata']) ? files['MonTitre/metadata'].at(0) : files['MonTitre/metadata']
        if (metadataFile){
            const metadata = JSON.parse(metadataFile.buffer.toString());
        }
        if ( metadataFile instanceof File ) console.log(metadataFile.toString()) */
        return res.status(200).json({ msg: 'Temporary message' });
    });
};


export default withIronSessionApiRoute(handler, ironOptions)



async function handler (req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    console.log('Method ... : ', req.method)
    if (req.method === 'POST') {
        const form = new formidable.IncomingForm();
        try {
            form.parse(req, async (err, fields, files) => {
                console.log("into form")
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error parsing form data' });
                }

                console.log("Files : ", Object.keys(files))
                console.log("Fields : ", fields)
                
                return res.status(200).json({ msg:'Coucou' });
            })
        } catch (err) {
            console.log(err)
            return res.status(500).json({ error: 'Error formidable' });
        } 
    } else {
        console.log('error method ', req.method)
        return res.status(500).json({ error: 'Error method' });
    }
}
/*
        // ReadStream generation
        const options: PinataPinOptions = {
            pinataMetadata: { name: `TheSource article - ${req.body.title}` },
            pinataOptions: { cidVersion: 0 }
        };
        const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET)
 
        pinata.pinFileToIPFS(stringToStream(req.body.article), options)
            .then((result) => {
                const body = {
                    description: `Create by ${req.body.author} in ${req.body.quantity} copies`,
                    image: result.IpfsHash,
                    name: req.body.title,
                };
                console.log("BODY : ....")
                console.log(body)
                pinata.pinJSONToIPFS(body, options).then((json) => {
                    console.log(json);
                    return res.status(200).send(json)
                }).catch((err) => {
                    console.log(err);
                    return res.status(500).json({ error: 'Error pinJSONToIPFS' });
                });
 
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ error: 'Error pinFileToIPFS' });
            });
    } else {
        return res.status(400).send({ error: 'Wrong method' })
    } */

/* function stringToStream(str: string) {
    const stream = new Readable();
    stream.push(str);
    stream.push(null);
    return stream;
} */

/* const handleFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const fileContent = reader.result as string;
            resolve(fileContent);
        };

        reader.onerror = () => {
            reject(reader.error);
        };

        reader.readAsText(file);
    });
}; */

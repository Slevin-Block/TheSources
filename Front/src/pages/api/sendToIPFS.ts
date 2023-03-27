import { Readable } from 'stream';
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../components/Connection/IronOptions'
import pinataSDK, { PinataPinOptions } from '@pinata/sdk'

interface Session {
    nonce?: string;
    siwe?: string;
}

const handler = async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    if (req.method === 'POST') {
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
    }

}


function stringToStream(str: string) {
    const stream = new Readable();
    stream.push(str);
    stream.push(null);
    return stream;
}

export default withIronSessionApiRoute(handler, ironOptions)
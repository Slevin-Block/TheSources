import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../components/Connection/IronOptions'
import { Readable } from 'stream';
import pinataSDK, { PinataPinOptions } from '@pinata/sdk'

interface Session {
    nonce?: string;
    siwe?: string;
}

const options : PinataPinOptions = {
    pinataMetadata: {
        name: "TheSource article",
    },
    pinataOptions: {
        cidVersion: 0
    }
};

const handler = async (req: NextApiRequest & {session : Session}, res: NextApiResponse) => {
    if (req.method === 'POST'){
        // ReadStream generation
        const readableStream = new Readable({
            read() {
                this.push(req.body);
                this.push(null);
            },
        });
        const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.SECRET)
        pinata.pinFileToIPFS(readableStream, options).then((result) => {
            const body = {
                description: "TheSources article",
                image: result.IpfsHash,
                name: "BestNFT",
            };
        
            pinata.pinJSONToIPFS(body, options).then((json) => {
                console.log(json);
            }).catch((err) => {
                console.log(err);
            });
        
        }).catch((err) => {
            console.log(err);
        });

        console.log("Body : ", req.body)
        console.log("Session : ", req.session)
        return res.status(200)
    }else{
        return res.status(400)
    }
}

function cleanString(){

}


export default withIronSessionApiRoute(handler, ironOptions)
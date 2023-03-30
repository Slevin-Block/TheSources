import type { NextApiRequest, NextApiResponse } from 'next'
import pinataSDK from '@pinata/sdk'
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from '../../components/atoms/Connection/IronOptions';

/* export const config = {
    api: {
        bodyParser: false,
    }
};
 */
interface Session {
    nonce?: string;
    siwe?: string;
}

async function handler(req: NextApiRequest & { session: Session }, res: NextApiResponse) {
    console.log('UNPIN ...')
    try {
        let {cid} = JSON.parse(req.body)
        cid = cid.split('/').at(-1)
        const pinata = new pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);
        console.log('CID : ', cid)
        try{
            const result = await pinata.unpin(cid)
            console.log(result)
            return res.status(200).send({msg : `Unpin ${cid} successfull`})
        
        }catch(err){
            console.log(err);
            return res.status(500).send({msg : `Unpin error`})
        }
    } catch (err) {
        return res.status(500).send({msg : `Authentification error`})
    }
}
export default withIronSessionApiRoute(handler, ironOptions)

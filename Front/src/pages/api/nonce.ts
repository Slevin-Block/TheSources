import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../components/Connection/IronOptions'

import { generateNonce } from 'siwe'

interface Session {
    nonce?: string;
    siwe?: string;
}

const handler = async (req: NextApiRequest & {session : Session}, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'GET':
            req.session.nonce = generateNonce()
            await req.session.save()
            res.setHeader('Content-Type', 'text/plain')
            res.send(req.session.nonce)
            console.log("SESSION CREATE : ", req.session.nonce)
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default withIronSessionApiRoute(handler, ironOptions)

import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../configuration/IronOptions'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    console.log("Logout ...")
    const { method } = req
    switch (method) {
        case 'GET':
            req.session.destroy()
            res.send({ ok: true })
            break
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default withIronSessionApiRoute(handler, ironOptions)

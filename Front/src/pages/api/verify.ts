import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { ironOptions } from '../../components/Connection/IronOptions'
import { SiweMessage } from 'siwe'

interface Session {
    nonce?: string;
    siwe?: string;
}


const handler = async (req: NextApiRequest & { session: Session }, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'POST':
            try {
                const { message, signature } = req.body
                const siweMessage = new SiweMessage(message)
                const fields = await siweMessage.validate(signature)

                console.log("Verify ...", req.session.nonce, fields.nonce, fields.nonce !== req.session.nonce)
                if (fields.nonce !== req.session.nonce){
                    console.log("Verifying error")
                    return res.status(422).json({ message: 'Invalid nonce.' })
                }
                // @ts-ignore
                req.session.siwe = fields
                await req.session.save()
                res.json({ ok: true })
                console.log("Verifying successfull")
            } catch (_error) {
                console.log(_error)
                res.json({ ok: false })
            }
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default withIronSessionApiRoute(handler, ironOptions)

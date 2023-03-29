import { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'



export function useSignIn () {

    const [isPending, setIsPending] = useState(false)
    const { disconnect } = useDisconnect()
    const { address } = useAccount()
    const { chain } = useNetwork()
    const { signMessageAsync } = useSignMessage()

    useEffect(() => { !address && setIsPending(false) }, [address])

    const signIn = async() => {
        let nonce : string | undefined
        try {
            const nonceRes = await fetch('/api/nonce')
            nonce = await nonceRes.text()
        } catch (error) {
           return {ok : false, data: error as Error}
        }
        try {
            const chainId = chain?.id
            if (!address || !chainId) return

            // Create SIWE message with pre-fetched nonce and sign with wallet
            const objMessage = {
                domain: window.location.host,
                address,
                statement: 'Sign in with Ethereum to the app.',
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce
            }
            const message = new SiweMessage(objMessage)
            setIsPending(true)
            const signature = await signMessageAsync({
                message: message.prepareMessage(),
            })
            setIsPending(false)

            // Verify signature
            const verifyRes = await fetch('/api/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message, signature }),
            })
            if (!verifyRes.ok) {
                await fetch('/api/logout')
                disconnect()
                throw new Error('Error verifying message')
            }

            return {ok : true, data : address}
        } catch (error) {
            await fetch('/api/logout')
            disconnect()
            return {ok : false, data: error as Error}
        }
    }

    return {signIn, isPending}
}
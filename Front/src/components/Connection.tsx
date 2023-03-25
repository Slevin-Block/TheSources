import React, { useState, useEffect } from 'react'

import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { useRecoilState } from 'recoil'
import { UserState } from '../store/UserState'
import { useSignIn } from '../configuration/useSignIn'
export default function Connection() {

    const [user, setUser] = useRecoilState(UserState)
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect()
    const { isConnected, address } = useAccount()
    const { signIn, isPending } = useSignIn()
    const [onStart, setOnStart] = useState(true)

    // Search activ session
    useEffect(() => {
        const handler = async () => {
            try {
                const res = await fetch('/api/me')
                const json = await res.json()
                const isRegistred = !!json.address
                isRegistred && setUser((user) => ({ ...user, address: json.address, isRegistred, isConnected: true }))
                setOnStart(false)
            } catch (err) {
                console.log("Error : ", err)
            }
        }
        // 1. page loads
        handler()

        // 2. window is focused (in case user logs out of another window)
        window.addEventListener('focus', handler)
        return () => window.removeEventListener('focus', handler)
    }, [])

    // Search connection change
    useEffect(() => {
        if (!onStart){
            (async () => {
                let tempRegistred = false
                if (isConnected && !user.isRegistred) {
                    const res = await signIn()
                    if (res?.ok) {
                        tempRegistred = true
                    } else {
                        console.log(res)
                        await fetch('/api/logout')
                        disconnect()
                    }
                }
                setUser({ ...user, address, isConnected, isRegistred: tempRegistred })
            })()
        }
    }, [isConnected, onStart])

    return (
        <div>
            {!user.isConnected ? 
                (connectors
                 .filter(connector => (!!pendingConnector?.id && !error) ? pendingConnector?.id === connector.id : true)
                 .map((connector) => (
                    <button className={`btn btn-primary ${connector.name === 'MetaMask' ? 'Metamask' : ''}${connector.name === 'WalletConnect' ? 'WalletConnect' : ''} ${((isLoading &&
                        connector.id === pendingConnector?.id) || isPending) &&
                        'loader'}`}
                        disabled={isConnected}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                    >
                        {((isLoading && connector.id === pendingConnector?.id) || isPending) &&
                            <div className="spinner"></div>}
                    </button>
                )))
            
            :
                <button
                    onClick={async () => {
                        await fetch('/api/logout')
                        disconnect()
                    }}
                    className="btn btn-primary">
                    Disconnect
                </button>
            }
        </div>
    )
}

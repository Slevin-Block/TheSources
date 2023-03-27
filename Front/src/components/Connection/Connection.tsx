import React, { useState, useEffect } from 'react'

import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { useRecoilState } from 'recoil'
import { ConnectionState, initConnection } from './ConnectionState'
import { useSignIn } from './useSignIn'
export default function Connection() {

    const [connection, setConnection] = useRecoilState(ConnectionState)
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect()
    const { isConnected, address } = useAccount()
    const { signIn, isPending } = useSignIn()
    const [ onStart, setOnStart] = useState(true)

    // Search activ session
    useEffect(() => {
        const handler = async () => {
            try {
                const res = await fetch('/api/me')
                const json = await res.json()
                const isRegistred = !!json.address
                isRegistred && setConnection((connection) => ({ ...connection, address: json.address, isRegistred, isConnected: true }))
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
            if (isConnected && !connection.isRegistred) {
                (async () => {
                    const res = await signIn()
                    if (res?.ok) setConnection({ ...connection, address, isConnected, isRegistred: true })
                    else {
                        disconnect()
                        setConnection(initConnection)
                    }
                })()
            }

            if (!isConnected) setConnection({ address, isConnected, isRegistred: false })
        }
    }, [isConnected])

    return (
        <div>
            {!connection.isConnected ? 
                (connectors
                 .filter(connector => (isLoading || isPending) ? pendingConnector?.id === connector.id : true)
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
                        disconnect()
                        await fetch('/api/logout')
                    }}
                    className="btn btn-primary">
                    Disconnect
                </button>
            }
        </div>
    )
}

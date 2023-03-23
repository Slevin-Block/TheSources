import React, { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { User } from '../store/User'

export default function Connection() {
    const [user, setUser] = useRecoilState(User)
    const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
    const { disconnect } = useDisconnect()
    const { isConnected, address } = useAccount()

    useEffect(() => {
        setUser({ ...user, address, isConnected })
    }, [isConnected])

    if (!user.isConnected) {
        return (
            <div>
                {connectors.map((connector) => (
                    <button className="btn btn-primary"
                        disabled={isConnected}
                        key={connector.id}
                        onClick={() => connect({ connector })}
                    >
                        {connector.name}
                        {!connector.ready && ' (unsupported)'}
                        {isLoading &&
                            connector.id === pendingConnector?.id &&
                            ' (connecting)'}
                    </button>
                ))}
                {error && <div>{error.message}</div>}
            </div>

        )
    } else {
        if (!user.isRegistred) {
            return (
                <button onClick={() => disconnect()} disabled={!isConnected} >Disconnect</button>
            )
        } else {
            return <></>
        }
    }
}

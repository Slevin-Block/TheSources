import React, { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork, useSignMessage } from 'wagmi'
import { useSignIn } from './useSignIn'
import { MetaMask, WalletConnect } from '../svgs'
import styles from './Connection.module.css'

export default function Connection() {

    const [isRegistred, setIsRegistred] = useState(false)
    const { isConnected, address } = useAccount()
    const { disconnect } = useDisconnect()
    const { connect, connectors, isLoading, pendingConnector } = useConnect()
    const { signIn, isPending } = useSignIn()
    const [onStart, setOnStart] = useState(true)
    const { chain } = useNetwork()

    // Search activ session
    useEffect(() => {
        const handler = async () => {
            try {
                const res = await fetch('/api/me')
                const json = await res.json()
                !!json.address !== isRegistred && setIsRegistred(!!json.address)
                setOnStart(false)
            } catch (err) {
                console.log("Error : ", err)
            }
        }
        handler()
        window.addEventListener('focus', handler)
        return () => window.removeEventListener('focus', handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if(!onStart){
            // When reload windows
            if (isConnected && !isRegistred){
                (async () => {
                    const res = await signIn()
                    if (res?.ok) setIsRegistred(true)
                    else  handleDisconnect()
                })()

            // When Disconnect Metamask
            }else if (!isConnected && isRegistred){
                handleDisconnect()
            }
        }
    },[onStart, isConnected])

    useEffect(()=>{
        if (chain){
            if (chain?.unsupported) console.log("Mauvais réseau")
            else console.log("Bon réseau")
        }
    },[chain])


    const handleDisconnect = async () => {
        disconnect()
        setIsRegistred(false)
        await fetch('/api/logout')
    }

    return (
        <div className={styles.control}>
            {!isRegistred ?
                (connectors
                    .filter(connector => (isLoading || isPending) ? pendingConnector?.id === connector.id : true)
                    .map((connector) => (
                        <button className={`${((isLoading && connector.id === pendingConnector?.id) || isPending) && 'loader'}`}
                            disabled={isConnected}
                            key={connector.id}
                            onClick={() => connect({ connector })}
                        >
                            {connector.name === 'MetaMask' && <MetaMask className={styles.iconButton} />}
                            {connector.name === 'WalletConnect' && <WalletConnect className={styles.iconButton} />}
                            {((isLoading && connector.id === pendingConnector?.id) || isPending) &&
                                <div className="spinner"></div>}
                        </button>
                    )))

                :
                <button
                    onClick={handleDisconnect}
                >
                    Disconnect
                </button>
            }
        </div>
    )
}

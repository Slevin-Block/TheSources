import { useAccount, useConnect, useDisconnect  } from 'wagmi'
import { Account } from '../components'
import Editor from '../components/Editor'
import { Profile } from '../Profile'

function Page() {
  const { isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } = useConnect()
  const { disconnect } = useDisconnect()
 
  console.log(isConnected)
  console.log(connectors)


   return (
    <>
        <h1>address : {address}</h1>
        {isConnected ? 'Connecté' : 'Déconnecté'}

        {connectors.map((connector) => (
            <button
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
        <button onClick={() => disconnect()} disabled={!isConnected} >Disconnect</button>
        <Profile />
        <Account/>
        <Editor />
    </>
  )
}

export default Page

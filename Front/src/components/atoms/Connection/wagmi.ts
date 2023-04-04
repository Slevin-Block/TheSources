import { createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { polygonMumbai } from '@wagmi/core/chains'



import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai], [publicProvider()]
)

export const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode : true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

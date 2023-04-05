import { createClient, configureChains, mainnet } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { polygonMumbai} from '@wagmi/core/chains'



import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

/* const localhost = {
  chainId: 31337,
  displayName: 'Localhost Chain 31337',
  rpcUrls: ['http://localhost:8545'],
  blockExplorerUrls: ['https://etherscan.io/'],
}; */

const localhost = {
    id: 31337,
    name: "Localhost",
    network: "localhost",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["http://127.0.0.1:8545"],
        },
        public: {
            http: ["http://127.0.0.1:8545"],
        },
    },
}


const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, polygonMumbai, localhost], [publicProvider()]
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

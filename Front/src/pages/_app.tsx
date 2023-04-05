import '../styles/global.css';
import '../styles/button.css';
import '../styles/input.css';
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'


import { client } from '../components/atoms/Connection/wagmi'
import { RecoilRoot } from 'recoil';
import '../store/configRecoil';
export const marketplace = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function App({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    return (
        <RecoilRoot>
            <WagmiConfig client={client}>
                    <NextHead>
                        <title>The Source</title>
                    </NextHead>

                    {mounted && <Component {...pageProps} />}
            </WagmiConfig>
        </RecoilRoot>
    )
}

export default App

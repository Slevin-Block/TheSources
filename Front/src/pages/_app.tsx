import '../styles/global.css';
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from '../configuration/wagmi'
import { RecoilRoot } from 'recoil';

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

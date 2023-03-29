import '../styles/global.css';
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'

import { client } from '../components/atoms/Connection/wagmi'
import { RecoilRoot } from 'recoil';
import '../store/configRecoil';
import {theme} from '../styles/theme';



function App({ Component, pageProps }: AppProps) {
    const [mounted, setMounted] = React.useState(false)
    React.useEffect(() => setMounted(true), [])
    return (
        <RecoilRoot>
            <WagmiConfig client={client}>
                <ChakraProvider /* theme={theme} */>
                    <NextHead>
                        <title>The Source</title>
                    </NextHead>

                    {mounted && <Component {...pageProps} />}
                </ChakraProvider>
            </WagmiConfig>
        </RecoilRoot>
    )
}

export default App

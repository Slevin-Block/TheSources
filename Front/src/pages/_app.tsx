/* import '@uiw/react-markdown-preview/esm/styles/markdown.css' */

import '../style/style.css'
import type { AppProps } from 'next/app'
import NextHead from 'next/head'
import * as React from 'react'
import { WagmiConfig } from 'wagmi'

import { client } from '../wagmi'

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig client={client}>
        <NextHead>
          <title>My wagmi + ConnectKit App</title>
        </NextHead>

        {mounted && <Component {...pageProps} />}
    </WagmiConfig>
  )
}

export default App

import { config } from 'dotenv'
import { env as serverConfiguration } from './src/env/server.mjs'


export const env = serverConfiguration

/**
 * Don't be scrared of the generics here.
 * All they do is to give us autocompletion when using this
 *
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows though to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
    return config
}

export default defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: [{ loader: '@svgr/webpack', options: { icon: true } }],
        })
        config.resolve.fallback = {
            ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
            // by next.js will be dropped. Doesn't make much sense, but how it is
            fs: false, // the solution
        };
        return config
    },
})
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
import * as url from "node:url";

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react()
    ],
    define: {
        "node:url" : url
    },
    build: {
        rollupOptions: {
            plugins: [rollupNodePolyFill()]
        }
    },
    resolve: {
        alias: {
            './runtimeConfig': './runtimeConfig.browser'
        }
    }
})

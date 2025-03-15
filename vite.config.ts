import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
// @ts-ignore
import config from "./workbox-config";
import {injectManifest} from "workbox-build";

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        VitePWA({
            injectManifest: {
                injectionPoint: undefined,
                globDirectory: './dist',
                globPatterns: ['**/*.{js,css,html,png,svg}'],
            },
            srcDir: "src",
            outDir: "public",
            strategies: "injectManifest",
            filename: "service-worker.js",
            registerType: "autoUpdate"
        })
    ],
    build: {
        sourcemap: true
    }
})

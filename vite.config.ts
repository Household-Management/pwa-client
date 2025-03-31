import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    return ({
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
                outDir: mode === "production" ? "dist" : "public",
                strategies: "injectManifest",
                filename: "service-worker.js",
                registerType: "autoUpdate"
            })
        ],
        build: {
            sourcemap: true
        }
    })
});

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
import fs from 'fs';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

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
            sourcemap: true,
            rollupOptions: {
                plugins: [
                    // nodePolyfills()
                ]
            }
        },
        server: {
            middlewareMode: false,
            configureServer: (server: any) => {
                server.middlewares.use(async (req: any, res: any, next: any) => {
                    if (req.url === '/dev.app_config.json') {
                        const filePath = path.resolve(__dirname, 'dev.app_config.json');
                        try {
                            const fileContent = fs.readFileSync(filePath, 'utf-8');
                            res.setHeader('Content-Type', 'application/json');
                            res.end(fileContent);
                        } catch (err) {
                            res.statusCode = 404;
                            res.end('Configuration file not found');
                        }
                    } else {
                        next();
                    }
                });
            }
        },
        resolve: {
            alias: {
                buffer: 'buffer',
            }
        },
        optimizeDeps: {
            include: ['buffer'],
        }
    });
});
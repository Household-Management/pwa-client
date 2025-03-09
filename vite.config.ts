import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import json from "@rollup/plugin-json";

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react()
    ],
    build: {
        sourcemap: true
    }
})

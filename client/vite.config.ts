import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc';
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        {enforce: 'pre', ...mdx({/* jsxImportSource: …, otherOptions… */})},
        //react({include: /\.(jsx|js|mdx|md|tsx|ts)$/}),
        react(),
        tailwindcss(),
        tsconfigPaths()
    ],
        build: {
        outDir: "build",
        assetsDir: "static",
    },
    assetsInclude: [
        "**/*.xlsx",
    ],
    server: {
        port: 3000,
        /* fail if port 3000 is in use; cors is setup for an origin with port 3000 */
        strictPort: true,
        open: '/',
        proxy: {
            "/api": {
                target: "http://localhost:9000",
                changeOrigin: true,
                secure: false,
            }
        }
    }
})


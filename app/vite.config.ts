// import react from '@vitejs/plugin-react-swc'
import path from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import topLevelAwait from "vite-plugin-top-level-await";
// import vercel from 'vite-plugin-vercel';
import wasm from "vite-plugin-wasm";

// https://vitejs.dev/config/
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [
    react(),
    // vercel(),
    wasm(),
    topLevelAwait(),
     viteStaticCopy({
      targets: [
        {
          src: 'node_modules/onnxruntime-web/dist/*.wasm',
          dest: '.'
        }
      ]
    }),
  ],
  worker: {
    plugins: [wasm(), topLevelAwait()],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
      __APP_ENV__: process.env.VITE_VERCEL_ENV,
    },
  optimizeDeps: {
    include: [
      "onnxruntime-web"
    ],
  }
})

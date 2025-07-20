import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      srcDir: "src/sw",
      filename: "cacheServiceWorker.ts",
      strategies: "injectManifest",
      injectRegister: false,
      manifest: false,
      injectManifest: {
        injectionPoint: undefined,
      },
      devOptions: {
        enabled: true
      },
    })
  ],
  appType: 'mpa',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog.html'),
        resume: resolve(__dirname, 'resume.html')
      }
    }
  }
})

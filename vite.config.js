// create by LamberthRumpaidus
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [VitePWA({
    strategies: 'injectManifest',
    srcDir: 'src/pwa',
    filename: 'sw.js',
    registerType: 'prompt',
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2,json}'],
      maximumFileSizeToCacheInBytes: 3 * 1024 * 1024
    },
    manifest: {
      name: 'LAST ASYLUM', short_name: 'LAST ASYLUM',
      description: 'Isometric survival, hunting, cooking and base defense.',
      start_url: './', scope: './', display: 'standalone',
      background_color: '#081714', theme_color: '#081714',
      icons: [
        { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
        { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
      ]
    }
  })],
  build: { target: 'es2022', cssCodeSplit: true, sourcemap: false }
});

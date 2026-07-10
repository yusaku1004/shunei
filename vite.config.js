import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.anthropic\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
      manifest: {
        name: '瞬英 - 瞬間英作文トレーニング',
        short_name: '瞬英',
        description: '森沢メソッドで瞬間英作文を鍛えるPWAアプリ。日本語を見て即座に英語へ変換する反復練習で、英会話の瞬発力を鍛えます。',
        lang: 'ja',
        start_url: '/',
        scope: '/',
        // アプリのダークテーマ実色（src/theme.js の THEME_COLORS と揃える）
        theme_color: '#14131f',
        background_color: '#14131f',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['education'],
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})

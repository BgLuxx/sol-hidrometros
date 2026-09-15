import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'],
      manifest: {
        name: 'SOL Soluções - Hidrômetros',
        short_name: 'SOL Hidrômetros',
        description: 'Lançamento e controle de leituras de hidrômetros - SOL Soluções em Água e Esgoto',
        theme_color: '#0e6ba8',
        background_color: '#0e6ba8',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // App shell + code precached -> app abre offline.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            // Fotos e dados do Supabase: tenta rede, cai pro cache quando não há sinal.
            urlPattern: ({ url }) => url.hostname.endsWith('.supabase.co'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-runtime',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 500, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})

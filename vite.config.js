import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  define: { __APP_VERSAO__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || 'local') },
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
        // O padrão é 2 MiB, e o Workbox IGNORA em silêncio o arquivo maior que
        // isso: o app simplesmente deixaria de abrir offline. Como o bundle
        // cresce a cada condomínio cadastrado (já tem 1,6 MB), o limite sobe.
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        // Sem isso, o Service Worker instalado na PRIMEIRA visita só passa a
        // controlar a página a partir da PRÓXIMA vez que abrir o site — ou
        // seja, se a pessoa instalar e for direto pro modo avião, ainda não
        // tem ninguém "no comando" pra servir o app do cache, e o
        // Safari/Chrome tenta ir na rede de verdade e falha. Com isso aqui,
        // assim que o Service Worker termina de instalar (poucos segundos),
        // ele já assume o controle na hora, sem precisar de uma 2ª visita.
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
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

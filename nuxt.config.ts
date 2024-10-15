// const sw = process.env.SW === 'true'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxt/icon',
    'nuxt-auth-utils',
    'nuxt-typed-router',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],

  experimental: { payloadExtraction: true, appManifest: true },

  app: { pageTransition: { name: 'page', mode: 'out-in' }, layoutTransition: { name: 'layout', mode: 'out-in' } },

  css: ['~/assets/css/transitions.css'],
  colorMode: { preference: 'dark', fallback: 'dark' },

  ui: { global: true },
  image: { dir: 'public' },
  icon: { clientBundle: { scan: true, sizeLimitKb: 256 } },

  runtimeConfig: {
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL,
    jwtSecret: process.env.JWT_SECRET,
    oauth: { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } },
  },

  $development: { hub: { database: true, blob: true, kv: true, remote: true } },
  hub: { database: true, blob: true, kv: true, remote: true },

  // pwa: {
  //   strategies: sw ? 'injectManifest' : 'generateSW',
  //   registerType: 'autoUpdate',
  //   client: { installPrompt: true },
  //   manifest: {
  //     name: 'Schmalify',
  //     short_name: 'Schmalify',
  //     description:
  //       'Schmalify is a second-hand marketplace designed for students in Schmalkalden, providing a dedicated platform to buy and sell items within the local student community. Schmalify aims to simplify the trading process and foster a more efficient way for students to connect and exchange goods.',
  //     background_color: '#111827',
  //     theme_color: '#111827',
  //     icons: [
  //       { src: 'icons/icon_64x64.png', sizes: '64x64', type: 'image/png' },
  //       { src: 'icons/icon_144x144.png', sizes: '144x144', type: 'image/png' },
  //       { src: 'icons/icon_192x192.png', sizes: '192x192', type: 'image/png' },
  //       { src: 'icons/icon_512x512.png', sizes: '512x512', type: 'image/png' },
  //     ],
  //   },
  //   workbox: { globPatterns: ['**/*.{js,css,html,png,svg,ico}'] },
  //   injectManifest: { globPatterns: ['**/*.{js,css,html,png,svg,ico}'] },
  // },

  devtools: { enabled: true },
  imports: { dirs: ['composables/**'] },
  vue: { propsDestructure: true },
  compatibilityDate: '2024-09-12',
})

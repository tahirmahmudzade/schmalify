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
    'pinia-plugin-persistedstate/nuxt',
    '@vueuse/nuxt',
    'nuxt-security',
  ],

  security: {
    requestSizeLimiter: {
      maxRequestSizeInBytes: 2000000,
      maxUploadFileRequestInBytes: 12000000,
      throwError: true,
    },
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:'],
        'script-src': ["'self'", 'https:', "'strict-dynamic'", "'nonce-{{nonce}}'"],
      },
      xXSSProtection: '1; mode=block',
    },
  },
  nitro: {
    routeRules: {
      '/api/auth/reset-password': { security: { rateLimiter: { tokensPerInterval: 6, interval: 60000, throwError: true } } },
      '/api/auth/login': { security: { rateLimiter: { tokensPerInterval: 6, interval: 60000, throwError: true } } },
    },
  },

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

  devtools: { enabled: true },
  imports: { dirs: ['composables/**'] },
  vue: { propsDestructure: true },
  compatibilityDate: '2024-09-12',
})

import pkg from './package.json'
import { canonicalUrl } from './utils/const'

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
    '@nuxtjs/i18n',
  ],

  security: {
    requestSizeLimiter: { maxRequestSizeInBytes: 8000000, maxUploadFileRequestInBytes: 10000000, throwError: true },
    rateLimiter: { tokensPerInterval: 150, interval: 30000, throwError: true },
    headers: {
      crossOriginEmbedderPolicy: 'unsafe-none',
      contentSecurityPolicy: {
        'img-src': ["'self'", 'data:', 'blob:', 'https:', 'https://*.googleusercontent.com'],
        'script-src': ["'self'", 'https:', "'strict-dynamic'", "'nonce-{{nonce}}'"],
        'script-src-attr': ["'self'", "'nonce-{{nonce}}'"],
      },
      xXSSProtection: '1; mode=block',
    },
  },
  nitro: {
    // prerender: { routes: ['/about'] },
    experimental: { websocket: true },
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
  image: { dir: 'public', format: ['webp'], domains: ['schmalify.com'], cloudflare: { baseURL: 'https://schmalify.com' } },
  icon: { clientBundle: { scan: true, sizeLimitKb: 256 } },

  runtimeConfig: {
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL,
    jwtSecret: process.env.JWT_SECRET,
    oauth: { google: { clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET } },

    public: { siteUrl: process.env.NUXT_PUBLIC_SITE_URL, canonicalUrl, buildDate: new Date(), appName: pkg.name },
  },

  i18n: {
    detectBrowserLanguage: { useCookie: true, fallbackLocale: 'en' },
    strategy: 'no_prefix',
    langDir: 'internationalization',
    defaultLocale: 'en',
    lazy: true,
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
    ],
  },

  $development: { hub: { database: true, blob: true, kv: true } },
  hub: { database: true, blob: true, kv: true },

  devtools: { enabled: true },
  imports: { dirs: ['composables/**'] },
  vue: { propsDestructure: true },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2024-09-25',
})

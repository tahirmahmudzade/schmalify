// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxtjs/device',
    '@nuxt/icon',
    'nuxt-auth-utils',
    'nuxt-typed-router',
  ],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  css: ['~/assets/css/transitions.css'],
  ui: { global: true },
  image: { dir: 'public' },

  runtimeConfig: {
    mailgunApiKey: process.env.MAILGUN_API_KEY,
    mailgunDomain: process.env.MAILGUN_DOMAIN,
    mailgunFromEmail: process.env.MAILGUN_FROM_EMAIL,
    jwtSecret: process.env.JWT_SECRET,
    oauth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  },

  $development: { hub: { database: true, blob: true, kv: true, remote: true } },
  hub: { database: true, blob: true, kv: true, remote: true },

  devtools: { enabled: true },
  imports: { dirs: ['composables/**'] },
  vue: { propsDestructure: true },
  compatibilityDate: '2024-09-12',
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxthub/core',
    '@nuxtjs/device',
    '@nuxt/icon',
    'nuxt-auth-utils',
  ],
  ui: {
    global: true,
  },
  $development: {
    hub: {
      database: true,
      blob: true,
      kv: true,
      remote: true,
    },
  },
  hub: {
    database: true,
    blob: true,
    kv: true,
  },
  image: {
    dir: 'public',
  },
  devtools: { enabled: true },
  imports: {
    dirs: ['composables/**'],
  },
  compatibilityDate: '2024-09-12',
})
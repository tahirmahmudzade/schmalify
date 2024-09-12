// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxthub/core'],
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
  image: {
    dir: 'public',
  },
  devtools: { enabled: true },
  imports: {
    dirs: ['composables/**'],
  },
  compatibilityDate: '2024-09-12',
})

// @ts-ignore
const isDev = import.meta.env.MODE === 'development'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/image', '@nuxthub/core', '@nuxtjs/device', '@nuxt/icon', 'nuxt-auth-utils'],

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  css: ['~/assets/css/transitions.css'],
  ui: { global: true },
  image: { dir: 'public' },

  $development: { hub: { database: true, blob: true, kv: true, remote: true } },
  hub: { database: true, blob: true, kv: true, remote: true },

  devtools: { enabled: true },
  imports: { dirs: ['composables/**'] },
  vue: { propsDestructure: true },
  compatibilityDate: '2024-09-12',
})

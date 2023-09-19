// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  routeRules: { '/**': { ssr: false } },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    // Options
  }
})

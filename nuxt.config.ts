export default defineNuxtConfig({
  compatibilityDate: '2025-05-12',
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt'],
  css: ['@/assets/styles/globals.scss'],
  runtimeConfig: {
    public: {
      spotifyClientId: '367fedc9bb4a422ab6a2de7d0c9e7519',
      canvasWidth: 768,
      canvasHeight: 768
    },
    spotifySecret: '64b4afe0873440e48c4bedaa96e7b51b',
  },
})

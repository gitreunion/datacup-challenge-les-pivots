export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: [
    '@/assets/style/main.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/style/_vars.scss" as *;
            @use "@/assets/style/mixins.scss" as *;
          `
        }
      }
    }
  },
  app: {
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },
  modules: [
    '@pinia/nuxt',
  ],
})

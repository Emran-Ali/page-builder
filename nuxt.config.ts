// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: [
    "primeicons/primeicons.css",
    "~/assets/tailwind.css"
  ],
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "@primevue/nuxt-module",
  ],
  routeRules: {
    "/page/builder/**": {
      ssr: false,
    },
  },
  build: {
    transpile: ["primevue"],
  },
  ssr: true,
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,
    }
  }
});

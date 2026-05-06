export default defineNuxtConfig({
  alias: {
    "@": ".",
    "@utils": "./utils/",
    "@components": "./components/",
    "@stores": "./stores/",
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["primeicons/primeicons.css"],
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
      BACKEND_URL: process.env.BACKEND_URL || "http://localhost:3000/",
    },
  },
  primevue: {
    components: {
      prefix: "Prime",
    },
    directives: {
      prefix: "v",
    },
    toastDuration: 3000,
    toastSeverity: "info",
  },
});

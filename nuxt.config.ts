export default defineNuxtConfig({
  typescript: {
    tsConfig: {
      compilerOptions: {
        strictPropertyInitialization: false,
      },
    },
  },
  alias: {
    "@": ".",
    "@utils": "./utils",
    "@components": "./components",
    "@stores": "./stores",
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
    databaseHost: process.env.DATABASE_HOST || "localhost",
    databasePort: parseInt(process.env.DATABASE_PORT || "5432"),
    databaseUsername: process.env.DATABASE_USERNAME || "postgres",
    databasePassword: process.env.DATABASE_PASSWORD || "1234",
    databaseName: process.env.DATABASE_NAME || "pagebuilder",
    jwtSecret:
      process.env.JWT_SECRET ||
      "random*number_to4_00*703*533*4353*5467*4435*3232",
    public: {
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

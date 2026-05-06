import { defineNuxtPlugin } from '#app'
import ToastService from 'primevue/toastservice'
import { useToast } from 'primevue/usetoast'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ToastService)
})
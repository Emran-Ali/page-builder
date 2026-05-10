import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore();
  
  // Only fetch user if not already authenticated (e.g. on first load/refresh)
  if (!authStore.isAuthenticated) {
    await authStore.fetchUser();
  }
});

import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();

  // Define public routes
  // /page/[slug] is public
  const isPublicPage = to.path.startsWith('/page/');
  const isLoginPage = to.path === '/login';

  // If user is logged in and tries to access login page, redirect to home
  if (auth.isLoggedIn && isLoginPage) {
    return navigateTo('/');
  }

  // If user is NOT logged in and tries to access a protected page
  if (!auth.isLoggedIn && !isLoginPage && !isPublicPage) {
    return navigateTo('/login');
  }
});

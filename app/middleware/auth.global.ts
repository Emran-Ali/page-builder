import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();

  // Define public routes
  const isHomePage = to.path === '/';
  const isLoginPage = to.path === '/login';
  const isPageSlug = to.path.startsWith('/page/');
  const isUnauthorizedPage = to.path === '/unauthorize';

  // Check if current route is public
  const isPublicRoute = isHomePage || isLoginPage || isPageSlug || isUnauthorizedPage;

  // If user is logged in and tries to access login page, redirect to home
  if (auth.isLoggedIn && isLoginPage) {
    return navigateTo('/');
  }

  // If user is NOT logged in and tries to access a protected page
  if (!auth.isLoggedIn && !isPublicRoute) {
    return navigateTo('/login');
  }
});

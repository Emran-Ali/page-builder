import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const auth = useAuthStore();
  const urlToken = to.query.token as string;

  if (urlToken) {
    auth.storeTokenInCookie(urlToken);
    await auth.verifyUser(urlToken);
    if (auth.getIsUser) {
      const cleanQuery = {...to.query};
      delete cleanQuery.token;
      return navigateTo(
        {
          path: to.path,
          query: Object.keys(cleanQuery).length > 0 ? cleanQuery : undefined,
        },
        {replace: true},
      );
    } else {
      auth.clearUserToken();
      return navigateTo("/login");
    }
  }

  if (!auth.isLoggedIn && to.path !== "/login") {
    const hasValidAccess = await auth.checkUserAccess();
    if (!hasValidAccess) {
      return navigateTo("/login");
    }
  }
});

import {useUserVerifyStore} from "../stores/admin-verify";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only apply to builder routes
  if (!to.path.startsWith("/page/builder/")) {
    return;
  }

  // If we're already on the unauthorized page, don't apply middleware
  if (to.path === "/page/unauthorized") {
    return;
  }

  const userStore = useUserVerifyStore();
  const urlToken = to.query.token as string;

  try {
    // If there's a token in URL, handle it
    if (urlToken) {
      // Store token and verify
      userStore.storeTokenInCookie(urlToken);
      await userStore.verifyUser(urlToken);

      // If verification successful, redirect to clean URL
      if (userStore.getIsUser) {
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
        // Token invalid, clear and redirect
        userStore.clearUserToken();
        return navigateTo("/page/unauthorized", {replace: true});
      }
    } else {
      // No URL token, check existing cookie
      const hasValidAccess = await userStore.checkUserAccess();
      if (!hasValidAccess) {
        return navigateTo("/page/unauthorized", {replace: true});
      }
    }
  } catch (error) {
    console.error("User verification failed:", error);
    userStore.clearUserToken();
    return navigateTo("/page/unauthorized", {replace: true});
  }
});

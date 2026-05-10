import { google } from "googleapis";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  console.log("api call ");

  if (!config.googleClientId || !config.googleCallbackUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: "Google OAuth credentials not configured",
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleCallbackUrl,
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
    prompt: "select_account",
  });
  console.log(url, "this is url");

  return { url };
});

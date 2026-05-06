import {google} from "googleapis";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const oauth2Client = new google.auth.OAuth2(
    config.public.googleClientId,
    config.googleClientSecret,
    config.public.googleCallbackUrl,
  );

  const url = new URL(
    event.node.req.url || "",
    config.public.googleCallbackUrl,
  );
  const code = url.searchParams.get("code");
  if (!code) {
    return {error: "No code provided"};
  }

  const {tokens} = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // You can fetch user info here if needed
  const oauth2 = google.oauth2({version: "v2", auth: oauth2Client});
  const userInfo = await oauth2.userinfo.get();

  // Set cookie or session here as needed
  // For now, just return user info
  return {
    user: userInfo.data,
    tokens,
  };
});

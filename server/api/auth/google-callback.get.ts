import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { code } = getQuery(event);

  if (!code) {
    return sendRedirect(event, '/login?error=no_code', 302);
  }

  if (!config.public.googleClientId || !config.googleClientSecret || !config.public.googleCallbackUrl) {
    return sendRedirect(event, '/login?error=config_missing', 302);
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      config.public.googleClientId,
      config.googleClientSecret,
      config.public.googleCallbackUrl
    );

    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Set secure cookie with token
    setCookie(event, 'auth_token', JSON.stringify(tokens), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Store user info in a separate cookie (can be read by client)
    setCookie(event, 'user_info', JSON.stringify(userInfo.data), {
      maxAge: 60 * 60 * 24 * 7,
    });

    return sendRedirect(event, '/', 302);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return sendRedirect(event, `/login?error=${encodeURIComponent(err.message)}`, 302);
  }
});

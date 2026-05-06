import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  if (!config.public.googleClientId || !config.public.googleCallbackUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Google OAuth credentials not configured',
    });
  }

  const oauth2Client = new google.auth.OAuth2(
    config.public.googleClientId,
    config.googleClientSecret,
    config.public.googleCallbackUrl
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'select_account',
  });

  return { url };
});

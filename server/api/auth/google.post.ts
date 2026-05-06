import { google } from 'googleapis';
import { H3Event, sendRedirect } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
  const config = useRuntimeConfig();
  const oauth2Client = new google.auth.OAuth2(
    config.public.googleClientId,
    config.public.googleClientSecret,
    config.public.googleCallbackUrl
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['profile', 'email'],
    prompt: 'select_account',
  });

  return sendRedirect(event, url, 302);
});

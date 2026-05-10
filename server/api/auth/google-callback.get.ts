import { google } from 'googleapis';
import { getDataSource } from '../../database';
import { User } from '../../entities/User';
import { generateAccessToken } from '~/utils/token';

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

    // Save user to database
    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository(User);

    const googleId = userInfo.data.id!;
    const email = userInfo.data.email!;
    const name = userInfo.data.name!;
    const avatar = userInfo.data.picture || null;

    let user = await userRepository.findOne({
      where: { googleId }
    });

    if (!user) {
      user = new User();
      user.googleId = googleId;
      user.email = email;
      user.name = name;
      user.avatar = avatar;
      await userRepository.save(user);
    } else {
      // Update existing user info
      user.email = email;
      user.name = name;
      user.avatar = avatar;
      await userRepository.save(user);
    }

    const accessToken = generateAccessToken({ id: user.id, email: user.email, name: user.name });

    // Set secure cookie with token
    setCookie(event, 'auth_token', JSON.stringify(accessToken), {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });


    return sendRedirect(event, '/', 302);
  } catch (err: any) {
    console.error('OAuth callback error:', err);
    return sendRedirect(event, `/login?error=${encodeURIComponent(err.message)}`, 302);
  }
});

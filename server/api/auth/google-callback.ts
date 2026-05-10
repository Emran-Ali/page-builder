import { google } from "googleapis";
import { generateAccessToken } from "../../../utils/token";
import { getDataSource } from "../../database/data-source";
import { UserEntity, type User } from "../../database/entities/User";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  let code = query.code as string;

  if (event.method === "POST") {
    const body = await readBody(event);
    if (body.code) {
      code = body.code;
    }
  }

  if (!code) {
    if (event.method === "POST") {
      throw createError({
        statusCode: 400,
        statusMessage: "Code is required",
      });
    }
    return sendRedirect(event, "/login?error=no_code", 302);
  }

  if (
    !config.googleClientId ||
    !config.googleClientSecret ||
    !config.googleCallbackUrl
  ) {
    if (event.method === "POST") {
      throw createError({
        statusCode: 500,
        statusMessage: "Google OAuth credentials not configured",
      });
    }
    return sendRedirect(event, "/login?error=config_missing", 302);
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      config.googleClientId,
      config.googleClientSecret,
      config.googleCallbackUrl,
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    // Save user to database
    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository<User>(UserEntity);

    const googleId = userInfo.data.id!;
    const email = userInfo.data.email!;
    const name = userInfo.data.name!;
    const avatar = userInfo.data.picture || null;

    let user = await userRepository.findOne({
      where: { googleId },
    });

    if (!user) {
      user = userRepository.create({
        googleId,
        email,
        name,
        avatar,
      });
      await userRepository.save(user);
    } else {
      // Update existing user info
      user.email = email;
      user.name = name;
      user.avatar = avatar;
      await userRepository.save(user);
    }

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    // Set secure cookie with token
    setCookie(event, "auth_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Otherwise, redirect to home page (traditional OAuth flow)
    return sendRedirect(event, "/", 302);
  } catch (err: any) {
    console.error("OAuth callback error:", err);
    if (event.method === "POST") {
      throw createError({
        statusCode: 500,
        statusMessage: err.message || "Authentication failed",
      });
    }
    return sendRedirect(
      event,
      `/login?error=${encodeURIComponent(err.message)}`,
      302,
    );
  }
});

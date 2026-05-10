import { authenticateUser } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await authenticateUser(event);
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        isActive: user.isActive,
      },
    };
  } catch (error) {
    return {
      success: false,
      user: null,
    };
  }
});

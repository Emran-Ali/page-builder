import { verifyAccessToken } from '../../utils/token';
import { getDataSource } from '../database/data-source';
import { UserEntity, type User } from '../database/entities/User';

export async function authenticateUser(event: any) {
  try {
    const cookie = getCookie(event, 'auth_token');

    if (!cookie) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      });
    }

    const decoded = verifyAccessToken(cookie) as any;
    const dataSource = getDataSource();
    const userRepository = dataSource.getRepository<User>(UserEntity);

    const user = await userRepository.findOne({
      where: { id: decoded.user.id }
    });

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      });
    }

    return user;
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired token'
    });
  }
}

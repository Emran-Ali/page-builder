import { getDataSource } from '../../database/data-source';
import { PageEntity, type Page } from '../../database/entities/Page';
import { authenticateUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user and get user data
    const user = await authenticateUser(event);

    const id = getRouterParam(event, 'id');
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository<Page>(PageEntity);

    const page = await pageRepository.findOne({
      where: { id, authorId: user.id }
    });

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found or you don\'t have permission to delete it'
      });
    }

    await pageRepository.remove(page);

    return {
      success: true,
      message: 'Page deleted successfully'
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to delete page'
    });
  }
});

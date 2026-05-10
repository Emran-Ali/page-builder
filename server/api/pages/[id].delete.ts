import { getDataSource } from '../../database';
import { Page } from '../../entities/Page';

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id');
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository(Page);

    const page = await pageRepository.findOne({ where: { id } });
    
    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
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

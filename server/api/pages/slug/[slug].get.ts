import { getDataSource } from '../../../database/data-source';
import { PageEntity, type Page } from '../../../database/entities/Page';

export default defineEventHandler(async (event) => {
  try {
    const slug = getRouterParam(event, 'slug');
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository<Page>(PageEntity);

    const page = await pageRepository.findOne({
      where: {
        slug,
        isPublished: true,
      },
      relations: ['author']
    });

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      });
    }

    return {
      success: true,
      data: page
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch page'
    });
  }
});

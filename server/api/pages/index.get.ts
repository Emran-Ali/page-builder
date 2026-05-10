import { getDataSource } from '../../database';
import { Page } from '../../entities/Page';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository(Page);

    const { page = 1, limit = 10, authorId, isPublished } = query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const where: any = {};
    if (authorId) where.authorId = authorId;
    if (isPublished !== undefined) where.isPublished = isPublished === 'true';

    const [pages, total] = await pageRepository.findAndCount({
      where,
      relations: ['author'],
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit)
    });

    return {
      success: true,
      data: pages,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to fetch pages'
    });
  }
});

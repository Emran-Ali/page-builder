import { getDataSource } from '../../database/data-source';
import { PageEntity, type Page } from '../../database/entities/Page';

export default defineEventHandler(async (event) => {
  try {
    const user = await authenticateUser(event);

    const query = getQuery(event);
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository<Page>(PageEntity);

    const { page = 1, limit = 10, authorId, isPublished } = query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    where.authorId = user.id;
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

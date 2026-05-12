import { getDataSource } from '../../database/data-source';
import { PageEntity, type Page } from '../../database/entities/Page';
import { authenticateUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {

    const user = await authenticateUser(event);

    const id = getRouterParam(event, 'id');
    const body = await readBody(event);
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository<Page>(PageEntity);

    const page = await pageRepository.findOne({ where: { id, authorId: user.id } });

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Page not found'
      });
    }

    // Update fields
    if (body.slug !== undefined) page.slug = body.slug;
    if (body.title !== undefined) page.title = body.title;
    if (body.excerpt !== undefined) page.excerpt = body.excerpt;
    if (body.pageJson !== undefined) page.pageJson = body.pageJson;
    if (body.featuredImage !== undefined) page.featuredImage = body.featuredImage;
    if (body.seoTitle !== undefined) page.seoTitle = body.seoTitle;
    if (body.seoDescription !== undefined) page.seoDescription = body.seoDescription;
    if (body.seoKeywords !== undefined) page.seoKeywords = body.seoKeywords;
    if (body.schema !== undefined) page.schema = body.schema;
    if (body.isPublished !== undefined) page.isPublished = body.isPublished;
    if (body.authorId !== undefined) page.authorId = body.authorId;

    const updatedPage = await pageRepository.save(page);

    return {
      success: true,
      data: updatedPage
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update page'
    });
  }
});

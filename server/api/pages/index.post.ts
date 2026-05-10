import { getDataSource } from '../../database';
import { Page } from '../../entities/Page';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository(Page);

    const page = new Page();
    page.slug = body.slug;
    page.title = body.title;
    page.excerpt = body.excerpt || null;
    page.pageJson = body.pageJson || null;
    page.featuredImage = body.featuredImage || null;
    page.seoTitle = body.seoTitle || null;
    page.seoDescription = body.seoDescription || null;
    page.seoKeywords = body.seoKeywords || null;
    page.schema = body.schema || null;
    page.isPublished = body.isPublished ?? true;
    page.authorId = body.authorId;

    const savedPage = await pageRepository.save(page);

    return {
      success: true,
      data: savedPage
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to create page'
    });
  }
});

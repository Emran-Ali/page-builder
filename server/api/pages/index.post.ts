import { getDataSource } from '../../database/data-source';
import { PageEntity, type Page } from '../../database/entities/Page';
import { authenticateUser } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  try {
    // Authenticate user
    const user = await authenticateUser(event);

    const body = await readBody(event);

    // Backend validation
    if (!body.slug || typeof body.slug !== 'string' || body.slug.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug is required and must be a non-empty string'
      });
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title is required and must be a non-empty string'
      });
    }

    // Validate slug format (alphanumeric, hyphens, underscores only)
    const slugRegex = /^[a-zA-Z0-9_-]+$/;
    if (!slugRegex.test(body.slug)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug can only contain letters, numbers, hyphens, and underscores'
      });
    }

    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository<Page>(PageEntity);

    // Check if slug already exists
    const existingPage = await pageRepository.findOne({
      where: { slug: body.slug.trim() }
    });

    if (existingPage) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Page with this slug already exists'
      });
    }

    const page = pageRepository.create({
      slug: body.slug.trim(),
      title: body.title.trim(),
      excerpt: body.excerpt?.trim() || null,
      pageJson: body.pageJson || null,
      featuredImage: body.featuredImage?.trim() || null,
      seoTitle: body.seoTitle?.trim() || null,
      seoDescription: body.seoDescription?.trim() || null,
      seoKeywords: body.seoKeywords?.trim() || null,
      schema: body.schema || null,
      isPublished: body.isPublished ?? true,
      authorId: user.id,
    });

    const savedPage = await pageRepository.save(page);

    return {
      success: true,
      data: savedPage
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || error.message || 'Failed to create page'
    });
  }
});

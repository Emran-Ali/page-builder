import {getDataSource} from "../../database/data-source";
import {PageEntity, type Page} from "../../database/entities/Page";
import {authenticateUser} from "../../utils/auth";

export default defineEventHandler(async (event) => {
  try {
    const user = await authenticateUser(event);

    const id = getRouterParam(event, "id");
    const dataSource = getDataSource();
    const pageRepository = dataSource.getRepository<Page>(PageEntity);

    const page = await pageRepository.findOne({
      where: {id, authorId: user.id},
      relations: ["author"],
    });

    if (!page) {
      throw createError({
        statusCode: 404,
        statusMessage: "Page not found",
      });
    }

    return {
      success: true,
      data: page,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || "Failed to fetch page",
    });
  }
});

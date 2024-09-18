import { Category } from '~/server/database/drizzle'
import { getAllCategories } from '~/server/service/category'

export default defineEventHandler(
  async (): Promise<{
    // statusCode: number
    categories: Category[]
  }> => {
    const categories = await getAllCategories()

    return {
      //   statusCode: 200,
      categories: categories.map((c) => ({
        ...c,
        id: encodeId(c.id),
      })),
    }
  }
)

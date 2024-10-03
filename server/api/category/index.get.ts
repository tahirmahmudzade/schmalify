import { Category } from '~/server/database/drizzle'
import { getAllCategories } from '~/server/service/category'

export default defineCachedEventHandler(
  async (): Promise<{ statusCode: number; categories: Category[] }> => {
    const categories = await getAllCategories()

    categories.sort((a, b) => {
      if (a.name === 'Free') return -1
      if (b.name === 'Free') return 1
      return 0
    })

    return {
      statusCode: 200,
      categories: categories.map(c => ({ ...c, id: encodeId(c.id) })),
    }
  },
  {
    maxAge: 60 * 60 * 24 * 7,
  },
)

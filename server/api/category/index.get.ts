import { Category } from '~/server/database/drizzle'
import { getAllCategories } from '~/server/service/category'

export default defineCachedEventHandler(
  async (): Promise<{ statusCode: number; categories: Category[] }> => {
    const categories = await getAllCategories()

    categories.sort((a, b) => {
      if (a.name === 'Free') return -1 // 'Free' goes to the start
      if (b.name === 'Free') return 1
      if (a.name === 'Other') return 1 // 'Other' goes to the end
      if (b.name === 'Other') return -1
      return a.name.localeCompare(b.name) // Alphabetical sorting for the rest
    })

    return { statusCode: 200, categories: categories.map(c => ({ ...c, id: encodeId(c.id) })) }
  },
  { maxAge: 60 * 60 * 24 * 7, swr: true },
)

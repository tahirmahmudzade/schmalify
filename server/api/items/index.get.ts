import { z } from 'zod'
import { Item } from '~/server/database/drizzle'
import { getAllItems } from '~/server/service/item'

const querySchema = z.object({ searchQuery: z.string() })

export default defineEventHandler(
  async (event): Promise<(Item & { seller: { avatar: string | null; location: string | null } | null })[]> => {
    try {
      const { searchQuery } = await getValidatedQuery(event, querySchema.parse)

      const items = await getAllItems(searchQuery)

      return items.map(item => ({
        ...item,
        id: encodeId(item.id),
        seller_id: encodeId(item.seller_id!),
        category_id: encodeId(item.category_id!),
      }))
    } catch (e) {
      console.log(e)

      throw createError({ statusCode: 500, message: 'Something went wrong, please try again later or contact support' })
    }
  },
)

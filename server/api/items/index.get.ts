import { z } from 'zod'
import { Item } from '~/server/database/drizzle'
import { getAllItems } from '~/server/service/item'

const querySchema = z.object({
  searchQuery: z.string().optional(),
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
})

export default defineEventHandler(
  async (event): Promise<(Item & { seller: { avatar: string | null; location: string | null } | null })[]> => {
    try {
      const { searchQuery, limit, offset } = await getValidatedQuery(event, querySchema.parse)

      const items = await getAllItems(searchQuery, limit, offset)

      return items.map(item => ({
        ...item,
        id: encodeId(item.id),
        seller_id: encodeId(item.seller_id!),
        category_id: encodeId(item.category_id!),
      }))
    } catch (err) {
      console.log('error getting items', err)

      throw createError({
        statusCode: 500,
        message: (err as string) || 'Something went wrong, please try again later or contact support',
      })
    }
  },
)

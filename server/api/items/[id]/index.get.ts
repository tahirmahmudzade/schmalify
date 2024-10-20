import { Item } from '~/server/database/drizzle'
import { getItemById } from '~/server/service/item'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    statusCode: number
    item: Item & {
      category: { name: string } | null
      seller: {
        avatar: string | null
        location: string | null
        lastName: string | null
        firstName: string | null
        phone: string | null
        username: string | null
      } | null
    }
  }> => {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({ statusCode: 400, message: 'Missing required parameter `id`' })
    }

    const decodedItemId = decodeId(paramId)

    try {
      const item = await getItemById(decodedItemId)

      if (!item) {
        throw createError({ statusCode: 404, message: 'Item not found' })
      }

      return {
        statusCode: 200,
        item: {
          ...item,
          category_id: encodeId(item.category_id!),
          seller_id: encodeId(item.seller_id!),
          id: encodeId(item.id),
          seller: { ...item.seller! },
        },
      }
    } catch (err) {
      console.log('error getting item', err)
      throw createError({ statusCode: 500, message: (err as string) || 'Error getting item data' })
    }
  },
)

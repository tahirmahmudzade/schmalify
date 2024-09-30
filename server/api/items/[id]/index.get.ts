import { Category, Item, User } from '~/server/database/drizzle'
import { getItemById } from '~/server/service/item'

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    statusCode: number
    item: Item & { category: Category | null; seller: User | null }
  }> => {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({ statusCode: 400, message: 'Missing required parameter `id`' })
    }

    const decodedItemId = decodeId(paramId)

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
        seller: {
          ...item.seller!,
          id: encodeId(item.seller!.id),
        },
      },
    }
  },
)

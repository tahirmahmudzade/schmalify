import { Item } from '~/server/database/drizzle'
import { getLatestItems } from '~/server/service/item'

export default defineEventHandler(
  async (): Promise<(Item & { seller: { avatar: string | null; location: string | null } | null })[]> => {
    const items = await getLatestItems()
    return items.map(item => ({
      ...item,
      id: encodeId(item.id),
      seller_id: encodeId(item.seller_id!),
      category_id: encodeId(item.category_id!),
    }))
  },
)

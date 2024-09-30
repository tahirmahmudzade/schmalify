import getAllItems from '~/server/service/item'

export default defineEventHandler(async () => {
  const items = await getAllItems()

  return {
    status: 200,
    items: items.map(item => ({
      ...item,
      id: encodeId(item.id),
      seller_id: encodeId(item.seller_id!),
      category_id: encodeId(item.category_id!),
    })),
  }
})

import { deleteItemById, getItemById } from '~/server/service/item'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const { user } = await requireUserSession(event)

  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'Missing required parameter id' })
  }

  const decodedUserId = decodeId(user.id)
  const decodedItemId = decodeId(paramId)

  const item = await getItemById(decodedItemId)

  if (!item) {
    throw createError({ statusCode: 404, message: 'Item not found' })
  }

  if (item.seller_id !== decodedUserId) {
    throw createError({ statusCode: 403, message: 'Forbidden access' })
  }

  await Promise.all([deleteItemById(decodedItemId), hubBlob().delete(`${user.id}/items/${item.image}`)])

  return { statusCode: 204, message: 'Item deleted successfully' }
})

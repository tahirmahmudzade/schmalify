import { deleteItemById, getItemById } from '~/server/service/item'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'Missing required parameter id' })
  }

  try {
    const { user } = await requireUserSession(event)

    const decodedUserId = decodeId(user.id)
    const decodedItemId = decodeId(paramId)

    const item = await getItemById(decodedItemId)

    if (!item) {
      throw createError({ statusCode: 404, message: 'Item not found' })
    }

    if (item.seller_id !== decodedUserId) {
      throw createError({ statusCode: 403, message: 'Forbidden access' })
    }

    const deletePaths = item.images!.map(image => `${user.id}/items/${image}`)

    await Promise.all([deleteItemById(decodedItemId), hubBlob().delete(deletePaths)])

    return { statusCode: 204, message: 'Item deleted successfully' }
  } catch (err) {
    console.log('error deleting item', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error deleting item' })
  }
})

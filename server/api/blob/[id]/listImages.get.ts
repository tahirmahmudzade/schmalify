import { getItemById } from '~/server/service/item'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedItemId = decodeId(paramId)

  const item = await getItemById(decodedItemId)

  if (!item || !item.images?.length) {
    throw createError({ statusCode: 404, message: !item ? 'Item not found' : 'Item has no images' })
  }

  return hubBlob().list({ prefix: `${encodeId(item.seller_id!)}/items`, limit: 3 })
})

import { getItemById } from '~/server/service/item'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedItemId = decodeId(paramId)

  try {
    const item = await getItemById(decodedItemId)

    if (!item || !item.image) {
      throw createError({ statusCode: 404, message: !item?.image ? 'Item has no image' : 'Item not found' })
    }

    const filename = `${encodeId(item.seller_id!)}/items/${item.image}`

    return hubBlob().serve(event, filename)
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error updating profile picture' })
  }
})

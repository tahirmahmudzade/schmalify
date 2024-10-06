import { getItemById } from '~/server/service/item'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  try {
    const { user } = await requireUserSession(event)

    const decodedItemId = decodeId(paramId)

    const item = await getItemById(decodedItemId)

    if (!item || !item.image) {
      throw createError({ statusCode: 404, message: !item?.image ? 'User has no profile picture' : 'User not found' })
    }

    const filename = `${user.id}/items/${item.image}`

    return hubBlob().serve(event, filename)
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error updating profile picture' })
  }
})

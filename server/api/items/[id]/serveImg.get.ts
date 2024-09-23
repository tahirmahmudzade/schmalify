import { getItemById } from '~/server/service/item'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const { user } = await getUserSession(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const decodedItemId = decodeId(paramId)

  const item = await getItemById(decodedItemId)

  if (!item || !item.image) {
    throw createError({ statusCode: 404, message: !item?.image ? 'User has no profile picture' : 'User not found' })
  }

  const filename = item.image === 'default-item.webp' ? 'default-item.webp' : `${user.id}/items/${item.image}`

  return hubBlob().serve(event, filename)
})

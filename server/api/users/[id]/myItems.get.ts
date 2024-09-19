import { Item } from '~/server/database/drizzle'
import { getUserById } from '~/server/service/user'

export default defineEventHandler(async (event): Promise<Item[]> => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({
      statusCode: 400,
      message: 'Missing required id',
    })
  }

  const decodedUserId = decodeId(paramId)

  const user = await getUserById(decodedUserId)

  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  return user.items.map((item) => ({
    ...item,
    id: encodeId(item.id),
  }))
})

import { Item } from '~/server/database/drizzle'
import { getUserById } from '~/server/service/user'

export default defineEventHandler(async (event): Promise<(Item & { category: { name: string } | null })[]> => {
  await requireUserSession(event)
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'Missing required id' })
  }

  const decodedUserId = decodeId(paramId)

  try {
    const user = await getUserById(decodedUserId)

    if (!user) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    return user.items.map(item => ({ ...item, id: encodeId(item.id), category_id: encodeId(item.category_id!) }))
  } catch (err) {
    console.log('error getting user items', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error getting user items' })
  }
})

import { Item, User } from '~/server/database/drizzle'
import { getUserById } from '~/server/service/user'

export default defineEventHandler(
  async (event): Promise<(User & { items: (Item & { category: { name: string } | null })[] }) | undefined> => {
    const paramId = getRouterParam(event, 'id')

    await requireUserSession(event)

    if (!paramId) {
      throw createError({ statusCode: 400, message: 'Missing required id' })
    }

    const decodedUserId = decodeId(paramId)

    try {
      const user: (User & { items: (Item & { category: { name: string } | null })[] }) | undefined =
        await getUserById(decodedUserId)

      if (!user) {
        throw createError({ statusCode: 404, message: 'User not found' })
      }

      return { ...user, id: encodeId(user.id) }
    } catch (err) {
      console.log('error getting user', err)
      throw createError({ statusCode: 500, message: (err as string) || 'Error getting user data' })
    }
  },
)

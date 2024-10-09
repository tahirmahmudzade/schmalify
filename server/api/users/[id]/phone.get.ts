import { getUserPhone } from '~/server/service/user'

export default defineEventHandler(async (event): Promise<{ phone: string | null }> => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'Missing required id' })
  }

  const decodedUserId = decodeId(paramId)

  await requireUserSession(event)

  const user = await getUserPhone(decodedUserId)

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const { phone } = user

  return { phone }
})

import { getUserById } from '~/server/service/user'

export default defineEventHandler(async (event) => {
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

  return {
    ...user,
    id: encodeId(user.id),
  }
})

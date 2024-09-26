import { getUserById } from '~/server/service/user'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedeUserId = decodeId(paramId)

  const user = await getUserById(decodedeUserId)

  if (!user || !user.avatar) {
    throw createError({ statusCode: 404, message: !user?.avatar ? 'User has no profile picture' : 'User not found' })
  }

  const filename = user.avatar === 'default-user.webp' ? 'default-user.webp' : `${paramId}/${user.avatar}`

  return hubBlob().serve(event, filename)
})
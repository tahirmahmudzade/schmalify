import { getUserImage } from '~/server/service/user'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedUserId = decodeId(paramId)

  const user = await getUserImage(decodedUserId)

  if (!user || !user.avatar) {
    throw createError({ statusCode: 404, message: 'Item not found' })
  }

  const filename = user.avatar === 'default-user.webp' ? 'default-user.webp' : `${paramId}/${user.avatar}`

  try {
    return await hubBlob().serve(event, filename)
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error updating profile picture' })
  }
})

import { getUserById, updateProfilePicture } from '~/server/service/user'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedUserId = decodeId(paramId)

  const form = await readFormData(event)

  const file = form.get('avatar') as File

  if (!file || !file.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(file, { maxSize: '4MB', types: ['image'] })

  const fileName = file.name

  const user = await getUserById(decodedUserId)

  if (user?.avatar && user.avatar !== 'default-user.webp') {
    try {
      await hubBlob().delete(`${paramId}/${user.avatar}`)
    } catch (e) {
      console.log('error deleting', e)
    }
  }
  try {
    await Promise.all([updateProfilePicture(decodedUserId, fileName), hubBlob().put(fileName, file, { prefix: paramId })])
    return { statusCode: 200, message: 'Profile picture updated' }
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: 'Error updating profile picture' })
  }
})

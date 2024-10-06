import { getUserById, updateProfilePicture } from '~/server/service/user'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedUserId = decodeId(paramId)

  try {
    const form = await readFormData(event)

    const file = form.get('avatar') as File

    processImage(file)

    const fileName = file.name

    const user = await getUserById(decodedUserId)

    if (user?.avatar && user.avatar !== 'default-user.webp') {
      await hubBlob().delete(`${paramId}/${user.avatar}`)
    }

    await Promise.all([updateProfilePicture(decodedUserId, fileName), hubBlob().put(fileName, file, { prefix: paramId })])
    return { statusCode: 200, message: 'Profile picture updated' }
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error updating profile picture' })
  }
})

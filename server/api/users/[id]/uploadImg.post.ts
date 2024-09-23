import { getUserById, updateProfilePicture } from '~/server/service/user'

export default defineEventHandler(
  async (
    event
  ): Promise<{
    statusCode: number
    message: string
  }> => {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({ statusCode: 400, message: 'No id provided' })
    }

    const decodedUserId = decodeId(paramId)

    const form = await readFormData(event)
    console.log('form', form)

    const file = form.get('avatar') as File
    console.log('file', file)

    if (!file || !file.size) {
      console.log('No file provided or file size is 0')

      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    ensureBlob(file, {
      maxSize: '2MB',
      types: ['image'],
    })

    console.log('passed ensureBlob')

    const fileName = file.name
    console.log('fileName', fileName)

    const user = await getUserById(decodedUserId)
    console.log('user avatar', user?.avatar)

    if (user?.avatar && user.avatar !== 'default-user.webp') {
      console.log('avatar exists,and is different from default deleting')
      try {
        await hubBlob().delete(`${paramId}/${user.avatar}`)
        console.log('deleted')
      } catch (e) {
        console.log('error deleting', e)
      }
    }
    try {
      await Promise.all([updateProfilePicture(decodedUserId, fileName), hubBlob().put(fileName, file, { prefix: paramId })])
      return {
        statusCode: 200,
        message: 'Profile picture updated',
      }
    } catch (err) {
      console.log('error updating profile picture', err)
      throw createError({ statusCode: 500, message: 'Error updating profile picture' })
    }
  }
)

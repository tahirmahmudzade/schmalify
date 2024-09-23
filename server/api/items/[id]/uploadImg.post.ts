import { getItemById, updateItemPicture } from '~/server/service/item'

export default defineEventHandler(
  async (
    event
  ): Promise<{
    statusCode: number
    message: string
  }> => {
    console.log('uploading item img')

    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({ statusCode: 400, message: 'No id provided' })
    }

    const { user } = await getUserSession(event)

    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const decodedItemId = decodeId(paramId)

    const form = await readFormData(event)

    const file = form.get('image') as File
    console.log('file', file)

    if (!file || !file.size) {
      console.log('No file provided or file size is 0')

      throw createError({ statusCode: 400, message: 'No file provided' })
    }

    // log to the console the file size in mb
    console.log('file size in mb', file.size / 1024 / 1024)

    ensureBlob(file, {
      maxSize: '2MB',
      types: ['image'],
    })

    console.log('passed ensureBlob')

    const item = await getItemById(decodedItemId)
    console.log('item', item)

    try {
      await Promise.all([
        updateItemPicture(decodedItemId, file.name),
        hubBlob().put(file.name, file, { prefix: `${user.id}/items` }),
      ])
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

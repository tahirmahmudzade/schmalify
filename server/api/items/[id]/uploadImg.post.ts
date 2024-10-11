import { updateItemPicture } from '~/server/service/item'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  try {
    const { user } = await requireUserSession(event)

    const decodedItemId = decodeId(paramId)

    const form = await readFormData(event)

    const file = form.get('image') as File

    processImage(file)

    await Promise.all([
      updateItemPicture(decodedItemId, file.name),
      hubBlob().put(file.name, file, { prefix: `${user.id}/items` }),
    ])
    return { statusCode: 200, message: 'Profile picture updated' }
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error updating profile picture' })
  }
})

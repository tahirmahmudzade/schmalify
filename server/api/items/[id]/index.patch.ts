import { UpdateItem } from '~/server/database/drizzle'
import { updateItemById } from '~/server/service/item'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  try {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({ statusCode: 400, message: 'Missing item id' })
    }

    const body = await readFormData(event)

    const { user } = await requireUserSession(event)

    const title = body.get('title')!.toString()
    const description = body.get('description')?.toString()
    const price = parseInt(body.get('price')!.toString())
    const condition = body.get('condition')!.toString()
    const image = body.get('image') as File

    const decodedItemId = decodeId(paramId)

    const itemData: UpdateItem = { price, title, description, condition: condition as Condition, image: image?.name }
    await updateItemById(decodedItemId, itemData)

    if (image && image.size) {
      processImage(image)
      hubBlob().put(image.name, image, { prefix: `${user.id}/items` })
    }

    return { statusCode: 204, message: 'Item updated successfully' }
  } catch (err) {
    console.log('Error: ', err)

    throw createError({ statusCode: 400, message: (err as string) || 'Something went wrong, please try again' })
  }
})

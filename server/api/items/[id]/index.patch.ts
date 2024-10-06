import { UpdateItem } from '~/server/database/drizzle'
import { getItemById, updateItemById } from '~/server/service/item'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  // 1. Get the item id from the URL
  const paramId = getRouterParam(event, 'id')
  // 2. If the item id is missing, return a 400 error
  if (!paramId) {
    throw createError({ statusCode: 400, message: 'Missing item id' })
  }

  try {
    // 3. Read the form data from the request
    const body = await readFormData(event)
    // 4. Get the user session
    const { user } = await requireUserSession(event)
    // 5. Get the title, description, price, condition, and image from the form data
    const title = body.get('title')!.toString()
    const description = body.get('description')?.toString()
    const price = parseInt(body.get('price')!.toString())
    const condition = body.get('condition')!.toString() as Condition
    const status = body.get('status')!.toString() as Status
    const image = body.get('image') as File

    // 6. Decode the item id
    const decodedItemId = decodeId(paramId)
    // 7. Get the item by id
    const isItem = await getItemById(decodedItemId)
    // 8. If the item is not found, return a 404 error
    if (!isItem) {
      throw createError({ statusCode: 404, message: 'Item not found' })
    }
    if (decodeId(user.id) !== isItem.seller_id) {
      throw createError({ statusCode: 403, message: 'Unauthorized to update this item' })
    }
    // 9. If the user is not the seller of the item, return a 403 error
    const itemData: UpdateItem = { price, title, description, condition: condition, image: image?.name, status }
    // 10. Update the item
    await updateItemById(decodedItemId, itemData)
    // 11. If the image exists and has a size, process the image and upload the new image
    if (image && image.size) {
      processImage(image)
      await hubBlob().put(image.name, image, { prefix: `${user.id}/items` })
    }
    // 12. Return a 204 status code and a success message
    return { statusCode: 204, message: 'Item updated successfully' }
  } catch (err) {
    console.log('Error: ', err)

    throw createError({ statusCode: 400, message: (err as string) || 'Something went wrong, please try again' })
  }
})

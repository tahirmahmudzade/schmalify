import { CreateItem } from '~/server/database/drizzle'
import { createItem } from '~/server/service/item'
import { processImage } from '~/server/utils/processImage'

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  try {
    const body = await readFormData(event)

    const { user } = await requireUserSession(event)

    const title = body.get('title')!.toString()
    const description = body.get('description')?.toString()
    const price = parseInt(body.get('price')!.toString())
    const condition = body.get('condition')!.toString()
    const categoryId = body.get('category_id')!.toString()

    const decodedUserId = decodeId(user.id)
    const decodedCategoryId = decodeId(categoryId)

    const images: string[] = []
    for (let i = 0; body.has(`image_${i}`); i++) {
      const image = body.get(`image_${i}`) as File

      const processedImageName = processImage(image) // Process each image

      try {
        await hubBlob().put(processedImageName, image, { prefix: `${user.id}/items` })
      } catch (err) {
        console.log('Error uploading image', err)
        throw createError({ statusCode: 500, message: 'Error uploading image' })
      }

      images.push(processedImageName) // Add the image name to the array
    }

    const itemData: Omit<CreateItem, 'id'> = {
      price,
      title,
      description,
      seller_id: decodedUserId,
      condition: condition as Condition,
      category_id: decodedCategoryId,
      images,
    }

    await createItem(itemData)

    return { statusCode: 201, message: 'Item created successfully' }
  } catch (err) {
    console.log('Error: ', err)

    throw createError({ statusCode: 400, message: (err as string) || 'Something went wrong, please try again' })
  }
})

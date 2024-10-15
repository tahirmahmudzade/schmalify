import { z } from 'zod'
import { getItemById } from '~/server/service/item'
import { processImageName } from '~/server/utils/processImage'

const querySchema = z.object({ fileName: z.string() })

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const query = await getValidatedQuery(event, querySchema.parse)

  const decodedItemId = decodeId(id)

  const item = await getItemById(decodedItemId)

  if (!item) {
    throw createError({ statusCode: 404, message: 'Item not found' })
  }

  const processedImageName = processImageName(query.fileName)

  try {
    return await hubBlob().serve(event, `${encodeId(item.seller_id!)}/items/${processedImageName}`)
  } catch (err) {
    console.log('error updating profile picture', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error updating profile picture' })
  }
})

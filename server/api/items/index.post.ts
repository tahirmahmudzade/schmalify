import z from 'zod'
import { createItem } from '~/server/service/item'

const itemSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(20, { message: 'Title must be at most 20 characters long' }),
  description: z.string().max(100, { message: 'Description must be at most 100 characters long' }).optional(),
  price: z.number().min(1, { message: 'Price must be greater than 0' }).max(5000, {
    message: 'Price must be at most 5000',
  }),
  condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], {
    message: 'Condition is required',
  }),
  category_id: z.string(),
})

export default defineEventHandler(
  async (
    event
  ): Promise<{
    statusCode: number
    message: string
    item: {
      title: string
      id: string
    }
  }> => {
    try {
      const body = await readValidatedBody(event, itemSchema.parse)
      console.log('body', body)

      const { user } = await getUserSession(event)

      if (!user) {
        console.log('No user found')

        throw createError({ statusCode: 401, message: 'Unauthorized' })
      }
      console.log('user', user)

      const decodedUserId = decodeId(user.id)
      const decodedCategoryId = decodeId(body.category_id)
      console.log('decodedUserId', decodedUserId)

      const item = await createItem({
        seller_id: decodedUserId,
        price: body.price,
        title: body.title,
        description: body.description,
        condition: body.condition,
        category_id: decodedCategoryId,
      })
      console.log('created item', item)

      return {
        statusCode: 201,
        message: 'Item created successfully',
        item: {
          title: item.title,
          id: encodeId(item.id),
        },
      }
    } catch (err) {
      console.log('Error: ', err)

      throw createError({
        statusCode: 400,
        message: (err as string) || 'Something went wrong, please try again',
      })
    }
  }
)

import z from 'zod'
import { createCategory } from '~/server/service/category'

const categorySchena = z.object({
  name: z.string().min(1, { message: 'Name is required' }).max(20, { message: 'Name must be at most 20 characters long' }),
  img: z.string().optional(),
})

export default defineEventHandler(
  async (event): Promise<{ statusCode: number; message: string; body: { id: string; name: string } }> => {
    try {
      const body = await readValidatedBody(event, categorySchena.parse)

      const newCategory = await createCategory(body)

      return {
        statusCode: 201,
        message: `Category ${newCategory.name} created successfully`,
        body: { id: encodeId(newCategory.id), name: newCategory.name },
      }
    } catch (err) {
      console.log('error creating category', err)
      throw createError({ statusCode: 500, message: (err as string) || 'Error creating category' })
    }
  },
)

import z from 'zod'
import { createItem } from '~/server/service/item'
import { phoneRegex } from '~/utils/const'

const itemSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(20, { message: 'Title must be at most 20 characters long' }),
  description: z
    .string()
    .max(100, { message: 'Description must be at most 100 characters long' })
    .optional(),
  price: z
    .number()
    .min(1, { message: 'Price must be greater than 0' })
    .max(5000, {
      message: 'Price must be at most 5000',
    }),
  condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], {
    message: 'Condition is required',
  }),
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .optional(),
  lastName: z.string().optional(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .regex(phoneRegex, {
      message: 'Phone number must start with + and include the country code',
    })
    .optional(),
  guestId: z.number().optional(),
  userId: z.string().optional(),
})

export default defineEventHandler(
  async (
    event
  ): Promise<{
    statusCode: number
    message: string
  }> => {
    const body = await readValidatedBody(event, itemSchema.parse)

    if (body.guestId) {
      const guest = await $fetch(`/api/guests/${body.guestId}`)

      if (!guest) {
        await $fetch('/api/guests', {
          method: 'POST',
          body: {
            firstName: body.firstName!,
            lastName: body.lastName,
            phone: body.phone!,
          },
        })
      }
    }

    const newItem = await createItem(body, body.userId, body.guestId)

    return {
      statusCode: 201,
      message: `Item ${newItem.title} created successfully`,
    }
  }
)

import z from 'zod'
import { createGuest } from '~/server/service/guest'
import { phoneRegex } from '~/utils/const'

const guestSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().optional(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .regex(phoneRegex, {
      message: 'Phone number must start with + and include the country code',
    }),
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, guestSchema.parse)

  const newGuest = await createGuest(body)

  return {
    statusCode: 201,
    message: `Guest ${newGuest.firstName} created successfully`,
  }
})

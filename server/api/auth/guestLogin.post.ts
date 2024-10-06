import z from 'zod'
import { createUser } from '~/server/service/user'
import { phoneRegex } from '~/utils/const'

const guestSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().optional(),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .regex(phoneRegex, { message: 'Phone number must start with + and include the country code' }),
})

export default defineEventHandler(async event => {
  try {
    const body = await readValidatedBody(event, guestSchema.parse)

    const newUser = await createUser({
      isGuest: true,
      firstName: body.firstName,
      phone: body.phone,
      lastName: body.lastName,
    })

    await replaceUserSession(
      event,
      { loggedInAt: new Date().toISOString(), user: { isGuest: true, id: encodeId(newUser.id) } },
      { maxAge: 60 * 60 * 24 * 3 }, // 3 days
    )

    return { statusCode: 200, guest: { ...newUser, id: encodeId(newUser.id) }, message: 'Guest login successful' }
  } catch (err) {
    console.log('Error: ', err)

    throw createError({ statusCode: 400, message: (err as string) || 'Something went wrong, please try again' })
  }
})

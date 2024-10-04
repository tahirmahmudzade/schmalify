import z from 'zod'
import { getUserByEmail } from '~/server/service/user'
import { encodeId } from '~/server/utils/encrypt'

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }).max(40, { message: 'Email must be at most 40 characters long' }),
  password: z
    .string({ message: 'Invalid password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' }),
})

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const body = await readValidatedBody(event, userSchema.parse)

  const isUser = await getUserByEmail(body.email)

  if (!isUser) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  const passwordMatch = await verifyPassword(isUser.password!, body.password)

  if (!passwordMatch) {
    throw createError({ statusCode: 401, message: 'Invalid email or password' })
  }

  await setUserSession(event, {
    loggedInAt: new Date().toISOString(),
    user: { email: isUser.email!, id: encodeId(isUser.id), username: isUser.username!, isGuest: false },
  })

  return { statusCode: 200, message: 'Login successful' }
})

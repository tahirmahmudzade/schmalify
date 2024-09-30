import z from 'zod'
import { hash } from 'ohash'
import { createUser, getUserByEmail } from '~/server/service/user'
import { CreateUser } from '~/server/database/drizzle'
import { encodeId } from '~/server/utils/encrypt'

const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }).max(40, { message: 'Email must be at most 40 characters long' }),
  password: z
    .string({ message: 'Invalid password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
})

export default defineEventHandler<{ body: CreateUser }>(async (event): Promise<{ statusCode: number; message: string }> => {
  const body = await readValidatedBody(event, userSchema.parse)

  const isUser = await getUserByEmail(body.email)

  if (isUser) {
    throw createError({ statusCode: 400, message: 'User already exists, please login' })
  }

  const hashedPassword = hash({ password: body.password })

  const userData: Omit<CreateUser, 'id'> = { ...body, password: hashedPassword }

  const user = await createUser(userData)

  await setUserSession(event, {
    loggedInAt: new Date().toISOString(),
    user: { email: user.email!, id: encodeId(user.id), username: user.username!, isGuest: false },
  })

  return { statusCode: 201, message: `Registration successful` }
})

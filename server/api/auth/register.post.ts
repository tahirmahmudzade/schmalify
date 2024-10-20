import z from 'zod'
import { createUser, getUserByEmail } from '~/server/service/user'
import { CreateUser } from '~/server/database/drizzle'

const userSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .trim()
    .max(40, { message: 'Email must be at most 40 characters long' }),
  password: z
    .string({ message: 'Invalid password' })
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' }),
  username: z
    .string()
    .trim()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
})

export default defineEventHandler<{ body: CreateUser }>(async (event): Promise<{ statusCode: number; message: string }> => {
  try {
    const body = await readValidatedBody(event, userSchema.parse)

    const isUser = await getUserByEmail(body.email)

    if (isUser) {
      throw createError({ statusCode: 400, message: 'User with this email already exists, please login' })
    }

    const hashedPassword = await hashPassword(body.password)

    const userData: Omit<CreateUser, 'id'> = { ...body, password: hashedPassword }

    const user = await createUser(userData)

    await setUserSession(event, {
      loggedInAt: new Date().toISOString(),
      user: { email: user.email!, id: encodeId(user.id), username: user.username!, isGuest: false },
    })

    return { statusCode: 201, message: `Registration successful` }
  } catch (err) {
    console.log('error creating user', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error creating user' })
  }
})

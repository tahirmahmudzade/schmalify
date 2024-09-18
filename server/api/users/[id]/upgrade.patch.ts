import { hash } from 'ohash'
import z from 'zod'
import {
  getUserByEmail,
  getUserById,
  updateUserById,
} from '~/server/service/user'

const userSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .max(40, { message: 'Email must be at most 40 characters long' }),
  password: z
    .string({ message: 'Invalid password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
})

export default defineEventHandler(
  async (
    event
  ): Promise<{
    statusCode: number
    message: string
  }> => {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({
        statusCode: 400,
        message: 'User id is required',
      })
    }
    const decodedUserId = decodeId(paramId)

    const body = await readValidatedBody(event, userSchema.parse)

    const guestUser = await getUserById(decodedUserId)

    if (!guestUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    const isUniqueUserEmail = await getUserByEmail(body.email)

    if (isUniqueUserEmail) {
      throw createError({
        statusCode: 400,
        message:
          'User with given email already exists, please login or use different email',
      })
    }

    const hashedPassword = hash({ password: body.password })

    await updateUserById(decodedUserId, {
      email: body.email,
      username: body.username,
      firstName: guestUser.firstName,
      lastName: guestUser.lastName,
      password: hashedPassword,
      isGuest: false,
      phone: guestUser.phone,
    })

    await setUserSession(event, {
      loggedInAt: new Date().toISOString(),
      user: {
        id: paramId,
        isGuest: false,
        email: body.email,
        username: body.username,
      },
    })

    return {
      statusCode: 200,
      message: 'User created successfully',
    }
  }
)

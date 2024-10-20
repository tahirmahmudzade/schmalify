import z from 'zod'
import { getUserByEmail, updateUserById } from '~/server/service/user'
import { MAX_PHONE_NUMBER_LENGTH } from '~/utils/const'

const userSchema = z.object({
  email: z.string().max(40, { message: 'Email must be at most 40 characters long' }).optional(),
  firstName: z.string().max(40).optional(),
  lastName: z.string().max(50).optional(),
  location: z.string().optional(),
  phone: z.string().max(MAX_PHONE_NUMBER_LENGTH, { message: 'Phone number must be at most 15 digits' }).optional(),
  avatar: z.string().optional(),
})

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'Missing required parameter id' })
  }

  try {
    await requireUserSession(event)

    const decodedUserId = decodeId(paramId)

    const body = await readValidatedBody(event, userSchema.parse)

    const updateUser = await updateUserById(decodedUserId, body)

    if (!updateUser) {
      throw createError({ statusCode: 404, message: 'User not found' })
    }

    if (body.email) {
      const isUser = await getUserByEmail(body.email)

      if (isUser) {
        throw createError({ statusCode: 400, message: 'User with this email already exists, please login' })
      }
    }

    return { statusCode: 200, message: 'Profile updated successfully' }
  } catch (error) {
    console.log('error', error)

    throw createError({
      statusCode: 500,
      message: (error as string) || 'Something went wrong please try again later, or send feedback to support',
    })
  }
})

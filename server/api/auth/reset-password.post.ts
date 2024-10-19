import { z } from 'zod'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { getUserByEmail, updatePassword } from '~/server/service/user'

const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(15, { message: 'Password must be at most 15 characters long' }),
    confirmPassword: z.string(),
    token: z.string({ message: 'Token is required' }),
  })
  .refine(data => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

export default defineEventHandler(async event => {
  try {
    const body = await readValidatedBody(event, resetSchema.parse)

    const decoded = await jwt.verify(body.token, process.env.JWT_SECRET || 'prvscret')

    if (!decoded) {
      throw createError({ statusCode: 403, message: 'Token is either expired or invalid' })
    }

    const { payload } = decoded as { payload: { email: string } }

    const user = await getUserByEmail(payload.email)

    if (!user) {
      throw createError({ statusCode: 404, message: 'Reset token is invalid' })
    }

    const hashedPassword = await hashPassword(body.password)

    await updatePassword(user.id, hashedPassword)

    return { statusCode: 200, message: 'Password reset successfully' }
  } catch (err) {
    console.log('error resetting password', err)
    throw createError({
      statusCode: 500,
      message: (err as string) || 'Token is either invalid or expired. Please try again.',
    })
  }
})

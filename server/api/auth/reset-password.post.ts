import { z } from 'zod'
import jwt from 'jsonwebtoken'
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
    const config = useRuntimeConfig()

    const body = await readValidatedBody(event, resetSchema.parse)

    const decoded = jwt.verify(body.token, config.jwtSecret)
    const { email } = decoded as { email: string }

    const user = await getUserByEmail(email)

    if (!user) {
      throw createError({ statusCode: 404, message: 'Reset token is invalid' })
    }

    const hashedPassword = await hashPassword(body.password)

    await updatePassword(user.id, hashedPassword)

    return { statusCode: 200, message: 'Password reset successfully' }
  } catch (err) {
    console.log('error resetting password', err)
    throw createError({ statusCode: 500, message: 'Token is either invalid or expired. Please try again.' })
  }
})

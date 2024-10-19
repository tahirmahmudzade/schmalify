import { z } from 'zod'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { getUserByEmail, updatePassword } from '~/server/service/user'

const resetSchema = z
  .object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(15, { message: 'Password must be at most 15 characters long' }),
    confirmPassword: z.string(),
    token: z.string({ message: 'Code is required' }),
  })
  .refine(data => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

export default defineEventHandler(async event => {
  try {
    const { email, password, token } = await readValidatedBody(event, resetSchema.parse)

    const user = await getUserByEmail(email.trim())

    if (!user) {
      throw createError({ statusCode: 404, message: 'Reset code is invalid' })
    }

    const decoded = (await jwt.verify(user.passwordResetToken || '', process.env.JWT_SECRET || 'prvscret')) as
      | { payload: { resetCode: number } }
      | undefined

    if (!decoded || decoded.payload.resetCode !== parseInt(token)) {
      throw createError({ statusCode: 403, message: 'Code is either expired or invalid' })
    }

    const hashedPassword = await hashPassword(password)

    await updatePassword(user.id, hashedPassword)

    return { statusCode: 200, message: 'Password reset successfully' }
  } catch (err) {
    console.log('error resetting password', err)
    throw createError({
      statusCode: 500,
      message: (err as string) || 'Code is either invalid or expired. Please try again.',
    })
  }
})

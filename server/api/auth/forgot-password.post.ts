import z from 'zod'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { getUserByEmail, updateUserResetToken } from '~/server/service/user'

const bodySchema = z.object({ email: z.string().email({ message: 'Invalid email' }) })

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  try {
    const { email } = await readValidatedBody(event, bodySchema.parse)

    const user = await getUserByEmail(email.trim())

    if (!user) {
      return { statusCode: 404, message: 'User with given email not found' }
    }

    const resetCode = generateResetCode()

    const token = await jwt.sign(
      { resetCode, exp: Math.floor(Date.now() / 1000) + 5 * 60 }, // 5 minutes
      process.env.JWT_SECRET || 'prvscret',
    )

    const htmlContent = getPasswordResetHtmlContent(resetCode)

    await Promise.all([
      updateUserResetToken(user.id, token),
      sendMail(
        email.trim(),
        'Password Reset Request',
        `Paste this token in the reset password form: ${resetCode}`,
        htmlContent,
      ),
    ])

    return { statusCode: 200, message: 'A password reset email will be sent.' }
  } catch (err) {
    console.log('error creating user', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error logging in' })
  }
})

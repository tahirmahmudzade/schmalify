import z from 'zod'
import jwt from 'jsonwebtoken'
import { sendMail } from '~/server/utils/sendEmail'
import { getUserByEmail } from '~/server/service/user'

const bodySchema = z.object({ email: z.string().email({ message: 'Invalid email' }) })

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  try {
    const config = useRuntimeConfig()
    const body = await readValidatedBody(event, bodySchema.parse)

    const user = await getUserByEmail(body.email)

    if (!user) {
      return { statusCode: 404, message: 'User with given email not found' }
    }

    const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: '15m' })

    await sendMail(body.email, 'Password Reset Request', `Paste this token in the reset password form: ${token}`)

    return { statusCode: 200, message: 'A password reset email will be sent.' }
  } catch (err) {
    console.log('error creating user', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error logging in' })
  }
})

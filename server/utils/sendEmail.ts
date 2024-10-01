import formData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(formData)
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY! })

export async function sendMail(to: string, subject: string, text: string) {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: '<noreply@schmalify.com>',
      to,
      subject,
      text,
    })

    console.log('✅ Email sent:', response)

    return response
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw createError({ statusCode: 500, message: 'Error sending email' })
  }
}

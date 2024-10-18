import formData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(formData)

const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY!, url: 'https://api.eu.mailgun.net' })

export async function sendMail(to: string, subject: string, text: string, html: string) {
  try {
    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: `<${process.env.MAILGUN_FROM_EMAIL}>`,
      to,
      subject,
      text,
      html,
    })

    console.log('✅ Email sent:', response)

    return response
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw createError({ statusCode: 500, message: 'Error sending email' })
  }
}

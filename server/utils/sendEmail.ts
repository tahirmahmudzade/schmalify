export async function sendMail(to: string, subject: string, text: string, html: string) {
  const form = new FormData()
  form.append('from', process.env.MAILGUN_FROM_EMAIL || 'noreply@schmalify.com')
  form.append('to', to)
  form.append('subject', subject)
  form.append('text', text)
  form.append('html', html)

  const url = `https://${process.env.MAILGUN_URL || 'api.eu.mailgun.net'}/v3/${process.env.MAILGUN_DOMAIN || 'sandbox.mgsend.net'}/messages`

  const credentials = btoa(`api:${process.env.MAILGUN_API_KEY}`)
  try {
    const response = await fetch(url, { method: 'POST', headers: { Authorization: `Basic ${credentials}` }, body: form })

    if (response.ok) {
      const output = await response.json()
      console.log('✅ Email sent:', output)
      return output
    } else {
      const errorText = await response.text()
      console.error('❌ Error sending email:', response.status, errorText)
      throw new Error(`Error sending email: ${response.statusText}`)
    }
  } catch (error) {
    console.error('❌ Error sending email:', error)
    throw new Error('Error sending email')
  }
}

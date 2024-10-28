import { z } from 'zod'

const bodySchema = z.object({ content: z.string().max(400), receiverId: z.string() })

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const { user } = await requireUserSession(event)

  const conversationId = getRouterParam(event, 'roomId')

  if (!conversationId) {
    throw createError({ statusCode: 400, message: 'Invalid Conversation ID' })
  }

  const { receiverId, content } = await readValidatedBody(event, bodySchema.parse)

  const timestamp = new Date().toISOString()
  const key = `messages:${conversationId}:${timestamp}`

  const messageData: MessageData = { senderId: user.id, receiverId, content, timestamp }

  await hubKV().set(key, messageData, { ttl: 259200 }) // days: 3

  return { statusCode: 201, message: `Message Saved` }
})

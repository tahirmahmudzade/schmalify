import { z } from 'zod'

const bodySchema = z.object({ content: z.string().max(400), senderId: z.string(), receiverId: z.string() })

export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  const roomId = getRouterParam(event, 'roomId')

  const { senderId, receiverId, content } = await readValidatedBody(event, bodySchema.parse)

  const timestamp = new Date().toISOString()
  const key = `messages:${roomId}:${timestamp}`

  const messageData: MessageData = { senderId, receiverId, content, timestamp }

  await hubKV().set(key, messageData, { ttl: 432000 })

  return { statusCode: 201, message: `Message Saved` }
})

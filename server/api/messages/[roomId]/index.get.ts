export default defineEventHandler(async (event): Promise<{ statusCode: number; data: MessageData[] }> => {
  const roomId = getRouterParam(event, 'roomId')

  if (!roomId) {
    throw createError({ statusCode: 400, message: 'roomId is required' })
  }

  const keys = await hubKV().keys(`messages:${roomId}`)

  const messages = await hubKV().getItems<MessageData>(keys.map(key => ({ key })))

  const filteredMessages = messages.filter(message => message.value !== null).map(message => message.value)

  const sortedMessages = filteredMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

  return { statusCode: 200, data: sortedMessages }
})

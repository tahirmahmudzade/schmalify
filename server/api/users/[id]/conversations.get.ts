import { Conversation } from '~/server/database/drizzle'
import { getUserConversations } from '~/server/service/conversation'
import { getUserById } from '~/server/service/user'

export default defineEventHandler(async (event): Promise<{ statusCode: number; conversations: Conversation[] }> => {
  await requireUserSession(event)

  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'id is required' })
  }

  const decodedUserId = decodeId(paramId)

  const user = await getUserById(decodedUserId)

  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  const conversations: Conversation[] = await getUserConversations(decodedUserId)

  return {
    statusCode: 200,
    conversations: conversations.map(c => ({ ...c, id: encodeId(c.id), participants: c.participants!.map(encodeId) })),
  }
})

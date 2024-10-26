import { and, Conversation, CreateConversation, eq, sql, tables, useDrizzle } from '../database/drizzle'

export function getConversationByParticipants(
  buyerId: string,
  sellerId: string,
): Promise<{ id: string; participants: string[] | null; lastUpdated: string | null } | undefined> {
  return useDrizzle().query.conversation.findFirst({
    where: eq(tables.conversation.participants, [buyerId, sellerId]),
  })
}

export function getConversationById(conversationId: string): Promise<Conversation | undefined> {
  return useDrizzle().query.conversation.findFirst({ where: eq(tables.conversation.id, conversationId) })
}

export function createConversation(conversationData: CreateConversation) {
  return useDrizzle().insert(tables.conversation).values(conversationData)
}

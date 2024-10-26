import { sign } from '@tsndr/cloudflare-worker-jwt'
import { createConversation, getConversationByParticipants } from '~/server/service/conversation'
import { getItemSellerId } from '~/server/service/item'

export default defineEventHandler(async event => {
  try {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({ statusCode: 404, message: 'Missing id' })
    }

    const { user } = await requireUserSession(event)

    const decodedBuyerId = decodeId(user.id)
    const decodedItemId = decodeId(paramId)

    const item = await getItemSellerId(decodedItemId)

    if (!item) {
      throw createError({ statusCode: 404, message: 'Item not found' })
    }
    console.log('found item: ', item)

    const { seller_id } = item

    const existingConversation = await getConversationByParticipants(decodedBuyerId, seller_id!)

    let conversationId: string

    if (existingConversation) {
      console.log('found existing conversation: ', existingConversation)

      conversationId = existingConversation.id
      console.log('set up conversationId: ', conversationId)
    } else {
      console.log('creating new conversation')

      conversationId = generateRandomToken(16)

      console.log('generated conversationId: ', conversationId)

      await createConversation({ id: conversationId, participants: [decodedBuyerId, seller_id!] })
      console.log('created conversation')
    }

    const tempToken = await sign(
      { userId: user.id, exp: Math.floor(Date.now() / 1000) + 15 * 60 },
      process.env.JWT_SECRET || 'prvscret',
    )

    console.log('generated tempToken: ', tempToken)

    console.log('returning conversationId and tempToken', { conversationId, tempToken })

    return { conversationId, tempToken }
  } catch (error) {
    console.error('error: ', error)
    throw createError({
      statusCode: 500,
      message: (error as string) || 'Something went wrong creating conversation',
    })
  }
})

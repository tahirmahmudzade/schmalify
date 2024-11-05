import { parseURL, getQuery } from 'ufo'
import { verify } from '@tsndr/cloudflare-worker-jwt'
import { getConversationById } from '~/server/service/conversation'

export default defineWebSocketHandler({
  async open(peer) {
    console.log('inside websocket')
    const parsedUrl = parseURL(peer.url)
    const queryParams = getQuery(parsedUrl.search)
    const conversationId = queryParams.conversationId as string | undefined
    const token = queryParams.token as string | undefined

    console.log('parsedUrl: ', parsedUrl)
    console.log('queryParams: ', queryParams)
    console.log('conversationId: ', conversationId)
    console.log('token: ', token)

    if (!conversationId || !token) {
      console.log('Missing conversationId or token')

      throw createError({ statusCode: 400, message: 'Missing conversationId' })
    }

    const decodedConversationId = decodeId(conversationId)

    let userId: string

    try {
      const decoded = (await verify(token, process.env.JWT_SECRET || 'prvscret')) as
        | { payload: { userId: string } }
        | undefined

      if (!decoded) {
        console.log('Invalid token')

        throw createError({ statusCode: 401, message: 'Invalid token' })
      }

      userId = decoded.payload.userId

      console.log('userId: ', userId)
    } catch (error) {
      console.error('Error verifying token:', error)
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }

    const conversation = await getConversationById(decodedConversationId)
    console.log('conversation: ', conversation)

    const decodedUserId = decodeId(userId)

    if (!conversation || !conversation.participants?.includes(decodedUserId)) {
      console.log('Conversation not found')

      throw createError({ statusCode: 404, message: 'Conversation not found' })
    }

    !peer.ctx && (peer.ctx = {})

    const otherParticipantId = conversation.participants.find(id => id !== decodedUserId)

    if (!otherParticipantId) {
      console.log('Other participant not found in conversation')

      throw createError({ statusCode: 404, message: 'Other participant not found in conversation' })
    }

    peer.ctx.userId = userId // encoded userId
    peer.ctx.conversationId = conversationId // encoded conversationId
    peer.ctx.room = `chat:${conversationId}` // room name with encoded conversationId
    peer.ctx.receiverId = encodeId(otherParticipantId) // encoded receiverId
    console.log('peer.ctx: ', peer.ctx)

    console.log('subscribing')

    peer.subscribe(peer.ctx.room)
    console.log('User joined room subscribe', peer.ctx.room)

    console.log('sending join message')

    peer.publish(peer.ctx.room, {
      content: 'User joined the chat',
      senderId: 'server',
      receiverId: peer.ctx.receiverId,
      timestamp: new Date().toISOString(),
    }) // send join message to room

    console.log('User joined room', peer.ctx.room)
  },
  close(peer) {
    const room = peer.ctx.room // room name with encoded conversationId
    const userId = peer.ctx.userId // encoded userId

    if (room) {
      peer.publish(room, {
        content: 'User left the chat',
        senderId: 'server',
        receiverId: peer.ctx.receiverId,
        timestamp: new Date().toISOString(),
      }) // send leave message to room
      peer.unsubscribe(room)
      console.log(`User ${userId} left room ${room}`)
    } else {
      console.log('peer.ctx is not set in close function')
    }
  },
  async message(peer, message) {
    try {
      const room: string = peer.ctx?.room // room name with encoded conversationId
      const senderId: string = peer.ctx?.userId // encoded userId
      const receiverId: string = peer.ctx?.receiverId // encoded receiverId
      const conversationId: string = peer.ctx?.conversationId // encoded conversationId

      if (!room || !senderId || !conversationId || !receiverId) {
        throw createError({
          statusCode: 400,
          message: 'Something went wrong sending the message, please try again later or contact support.',
        })
      }

      const content = message.text()

      const timestamp = new Date().toISOString()
      const messageData: MessageData = { senderId, receiverId, content, timestamp }

      const key = `messages:${conversationId}:${timestamp}` // key for message data

      await hubKV().set(key, messageData, { ttl: 259200 }) // days: 3

      peer.publish(room, messageData)
    } catch (error) {
      console.error('Error in message handler:', error)
      peer.send(JSON.stringify({ error: 'An error occurred while processing your message.' }))
      return
    }
  },
  error(peer, error) {
    console.log('erorrr')
    console.log('peer ', peer)
    console.error('WebSocket error:', error)
  },
})

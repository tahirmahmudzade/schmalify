import { parseURL, getQuery } from 'ufo'
import { verify } from '@tsndr/cloudflare-worker-jwt'
import { getConversationById } from '~/server/service/conversation'

export default defineWebSocketHandler({
  async open(peer) {
    const parsedUrl = parseURL(peer.url)
    const queryParams = getQuery(parsedUrl.search)
    const conversationId = queryParams.conversationId as string | undefined
    const token = queryParams.token as string | undefined

    if (!conversationId || !token) {
      throw createError({ statusCode: 400, message: 'Missing conversationId' })
    }
    let userId: string

    try {
      const decoded = (await verify(token, process.env.JWT_SECRET || 'prvscret')) as
        | { payload: { userId: string } }
        | undefined

      if (!decoded) {
        throw createError({ statusCode: 401, message: 'Invalid token' })
      }

      userId = decoded.payload.userId
    } catch (error) {
      console.error('Error verifying token:', error)
      throw createError({ statusCode: 401, message: 'Invalid token' })
    }

    const conversation = await getConversationById(conversationId)

    const decodedUserId = decodeId(userId)

    if (!conversation || !conversation.participants?.includes(decodedUserId)) {
      throw createError({ statusCode: 404, message: 'Conversation not found' })
    }

    if (!peer.ctx) {
      peer.ctx = {}
    }

    const otherParticipantId = conversation.participants.find(id => id !== decodedUserId)

    peer.ctx.userId = userId
    peer.ctx.conversationId = conversationId
    peer.ctx.room = `chat:item:${conversationId}`
    peer.ctx.receiverId = otherParticipantId

    peer.subscribe(peer.ctx.room)
    peer.publish(peer.ctx.room, `User ${userId} joined conversation ${conversationId}`)

    console.log(`User ${userId} joined conversation ${conversationId}`)
  },
  close(peer) {
    console.log('close')

    const room = peer.ctx.room
    const userId = peer.ctx.userId

    if (room) {
      peer.unsubscribe(room)
      console.log(`User ${userId} left room ${room}`)
    } else {
      console.log('peer.ctx is not set in close function')
    }
  },
  async message(peer, message) {
    try {
      const room = peer.ctx?.room
      const senderId = peer.ctx?.userId
      const receiverId = peer.ctx?.receiverId
      const conversationId = peer.ctx?.conversationId

      if (!room || !senderId || !conversationId || !receiverId) {
        console.log('peer.ctx is not set in message function')
        peer.send(JSON.stringify({ error: 'Invalid connection context' }))
        return
      }

      const content = message.text()
      console.log('content: ', content)

      // Handle heartbeat
      if (content.trim() === 'ping') {
        peer.send('pong')
        return
      }

      const timestamp = new Date().toISOString()
      const messageData: MessageData = { senderId, receiverId, content, timestamp }

      const key = `messages:${conversationId}:${timestamp}`
      await hubKV().set(key, messageData, { ttl: 432000 }) // 5 days i

      peer.publish(room, content)
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
  // message(peer, message) {
  //   const room = `${roomPrefix}${peer.id}`
  //   const content = message.text()

  //   if (content === 'ping') {
  //     // Respond with 'pong'
  //     peer.send('pong')
  //     return // Exit early to prevent further processing
  //   }

  //   peer.publish(room, content)
  // },
})

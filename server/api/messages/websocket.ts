import { verify } from '@tsndr/cloudflare-worker-jwt'
import { parseURL, getQuery } from 'ufo'
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
        | {
            payload: { userId: string }
          }
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
    peer.ctx.userId = userId
    peer.ctx.conversationId = conversationId
    peer.ctx.room = `chat:item:${conversationId}`

    peer.subscribe(peer.ctx.room)

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
  message(peer, message) {
    try {
      const room = peer.ctx?.room
      const userId = peer.ctx?.userId
      console.log('room: ', room)
      console.log('userId: ', userId)

      if (!room || !userId) {
        console.log('peer.ctx is not set in message function')
        peer.send(JSON.stringify({ error: 'Invalid connection context' }))
        return
      }

      const content = message.text()
      console.log('content: ', content)

      // Handle heartbeat
      if (content.includes('ping')) {
        peer.send('pong')
        return
      }

      // Construct message payload
      const msg = { senderId: userId, text: content, timestamp: Date.now() }
      console.log('msg: ', msg)

      // Broadcast the message to other participants
      peer.publish(room, JSON.stringify(msg))
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

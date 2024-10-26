const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws'
const host = process.env.NODE_ENV === 'production' ? 'schmalify.com' : 'localhost:3000'
console.log('node env: ', process.env.NODE_ENV)

export function useChatConnection(conversationId: string, tempToken: string, immediate = false) {
  const { user } = useUserSession()

  if (!user.value) {
    throw createError({ statusCode: 401, message: "You're not logged in, please log in to chat" })
  }

  console.log('protocol: ', protocol)
  console.log('host: ', host)

  console.log('conversationId: ', conversationId)
  console.log('tempToken: ', tempToken)

  return useWebSocket(`${protocol}://${host}/api/messages/websocket?conversationId=${conversationId}&token=${tempToken}`, {
    // heartbeat: { message: 'ping', interval: 1000, pongTimeout: 1000 },
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {
        alert('Failed to connect WebSocket after 3 retries')
      },
    },
    immediate,
  })
}

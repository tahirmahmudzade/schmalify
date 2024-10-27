const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws'
const host = process.env.NODE_ENV === 'production' ? 'schmalify.com' : 'localhost:3000'
console.log('node env: ', process.env.NODE_ENV)

export function useChatConnection(conversationId: string, tempToken: string, immediate = false) {
  const { user } = useUserSession()

  if (!user.value) {
    throw createError({ statusCode: 401, message: "You're not logged in, please log in to chat" })
  }

  return useWebSocket(`${protocol}://${host}/api/messages/websocket?conversationId=${conversationId}&token=${tempToken}`, {
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

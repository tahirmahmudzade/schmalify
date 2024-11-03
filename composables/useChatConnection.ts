const protocol = process.env.NODE_ENV === 'production' ? 'wss' : 'ws'
const host = process.env.NODE_ENV === 'production' ? 'schmalify.com' : 'localhost:3000'
console.log('node env: ', process.env.NODE_ENV)

export function useChatConnection<T>(conversationId: string, tempToken: string, immediate = false) {
  const { user } = useUserSession()
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  if (!user.value) {
    throw createError({ statusCode: 401, message: t("You're not logged in, please log in to chat") })
  }

  return useWebSocket<T>(
    `${protocol}://${host}/api/messages/websocket?conversationId=${conversationId}&token=${tempToken}`,
    {
      autoReconnect: {
        retries: 3,
        delay: 1000,
        onFailed() {
          alert(t('Failed to connect WebSocket after 3 retries'))
        },
      },
      immediate,
    },
  )
}

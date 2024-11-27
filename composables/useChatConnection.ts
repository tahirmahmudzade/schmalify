const protocol = location.protocol === 'https:' ? 'wss' : 'ws'

const host = location.host

export function useChatConnection<T>(conversationId: string, tempToken: string, immediate = false) {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

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

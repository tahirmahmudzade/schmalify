const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
console.log('location.protocol: ', location.protocol)

const host = location.host

console.log('protocol: ', protocol)
console.log('host: ', host)

export function useChatConnection<T>(conversationId: string, tempToken: string, immediate = false) {
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  console.log('laoding chat connection')

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

<script setup lang="ts">
const { status, data, send, open, ws, close } = useWebSocket(`ws://${location.host}/api/chat'`, {
  heartbeat: { message: 'ping', interval: 1000, pongTimeout: 1000 },
  autoReconnect: {
    retries: 3,
    delay: 1000,
    onFailed() {
      alert('Failed to connect WebSocket after 3 retries')
    },
  },
})

const history = ref<string[]>([])

watch(data, newData => {
  if (newData) {
    history.value.push(`server: ${newData}`)
  }
})

const message = ref('')
function sendData() {
  history.value.push(`client: ${message.value}`)
  if (status.value === 'OPEN') {
    send(message.value)
    message.value = ''
  }
}
</script>

<template>
  <div>
    <h1>WEBSOCKET</h1>
    <form @submit.prevent="sendData">
      <input v-model="message" />
      <button type="submit">Send</button>
    </form>
    <div v-for="msg in history" :key="msg">{{ msg }}</div>
  </div>
</template>

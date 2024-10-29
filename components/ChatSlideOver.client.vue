<script setup lang="ts">
const { sellerName, itemId } = defineProps<{ sellerName: string; itemId: string }>()

const isChatboxOpen = useChatboxState()

const { user } = useUserSession()

const conversationId = ref('')
const tempToken = ref('')

const {
  data: conversationData,
  error: conversationError,
  status: conversationStatus,
} = await useLazyFetch(`/api/items/${itemId}/conversation`)

watch([conversationData, conversationError], ([dataValue, errorValue]) => {
  if (!dataValue || errorValue) {
    closeConnection()
    useToast().add({ title: "Couldn't load messages, please try again later or contact support", color: 'red' })
    return
  }
  conversationId.value = dataValue.conversationId
  tempToken.value = dataValue.tempToken
})

const messages = ref<MessageData[]>([])

const {
  close: closeConnection,
  data: incomingData,
  send,
  status: connectionStatus,
} = useChatConnection(conversationId.value, tempToken.value, true)

const {
  data: messagesData,
  error: messagesError,
  status: messagesStatus,
} = await useLazyFetch<{ statusCode: number; data: MessageData[] }>(`/api/messages/${conversationId}`)

watch([messagesData, messagesError], ([dataValue, errorValue]) => {
  if (!dataValue || errorValue) {
    closeConnection()
    useToast().add({ title: "Couldn't load messages, please try again later or contact support", color: 'red' })
    return
  } else {
    messages.value = dataValue.data || []
  }
})

watch(incomingData, newData => {
  try {
    messages.value.push({
      receiverId: messagesData.value!.data[0]!.receiverId,
      senderId: messagesData.value!.data[0]!.senderId,
      content: newData,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    console.error('Failed to parse message', e)
  }
})

const message = ref('')

function sendData() {
  if (message.value.trim() && connectionStatus.value === 'OPEN') {
    messages.value.push({
      receiverId: '',
      senderId: user.value!.id,
      content: message.value,
      timestamp: new Date().toISOString(),
    })

    send(message.value)

    message.value = ''
  }
}

onBeforeUnmount(() => {
  closeConnection()
  isChatboxOpen.value = false
})
</script>

<template>
  <LoadingSpinner v-if="messagesStatus === 'pending' || conversationStatus === 'pending' || connectionStatus !== 'OPEN'" />
  <USlideover v-model="isChatboxOpen">
    <div class="flex flex-col h-full">
      <div class="flex items-center p-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="rounded-full bg-blue-500 w-10 h-10 flex items-center justify-center text-white">
            {{ sellerName.charAt(0).toUpperCase() || 'G' }}
          </div>
          <div class="text-lg font-semibold">{{ sellerName || '' }}</div>
        </div>
        <button @click="isChatboxOpen = false" class="ml-auto text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="(messageObj, index) in messages"
          :key="index"
          :class="{ 'ml-auto': messageObj.senderId === user?.id, 'mr-auto': messageObj.senderId !== user?.id }"
          class="max-w-[75%]"
        >
          <div
            :class="[
              'relative px-4 py-2 rounded-lg',
              messageObj.senderId === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800',
            ]"
            class="break-words"
          >
            <span>{{ messageObj.content }}</span>
            <!-- triangle arrow -->
            <div
              :class="[
                'absolute bottom-0 h-4 w-4',
                messageObj.senderId === user?.id ? 'right-0 -mr-2 bg-blue-500' : 'left-0 -ml-2 bg-gray-300',
              ]"
              :style="{
                clipPath:
                  messageObj.senderId === user?.id ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
              }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 border-t border-gray-200">
        <div class="flex">
          <input
            v-model="message"
            @keyup.enter="sendData"
            type="text"
            placeholder="Type your message..."
            class="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
          />
          <button
            @click="sendData"
            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </USlideover>
</template>

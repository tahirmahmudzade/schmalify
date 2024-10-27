<script setup lang="ts">
const { sellerName, itemId } = defineProps<{ sellerName: string; itemId: string }>()

const isChatboxOpen = useChatboxState()

const { user } = useUserSession()

const { data: conversationData, error: conversationError, pending } = await useFetch(`/api/items/${itemId}/conversation`)

if (conversationError.value || !conversationData.value) {
  throw createError({ statusCode: 404, message: 'Something went wrong, please try again later' })
}

const { conversationId, tempToken } = conversationData.value

const { data: messagesData, error: messagesError } = await useFetch<{ statusCode: number; data: MessageData[] }>(
  `/api/messages/${conversationId}`,
)

if (messagesError.value || !messagesData.value) {
  throw createError({ statusCode: 404, message: 'Failed to load messages' })
}
const messages = ref<MessageData[]>(messagesData.value.data || [])

const { close, data, send, status } = useChatConnection(conversationId, tempToken, true)

watch(data, (newData, oldData) => {
  console.log('newData', newData)
  console.log('oldData', oldData)

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
  console.log('Sending message', message.value)

  if (message.value.trim() && status.value === 'OPEN') {
    console.log('open')
    console.log('message.value', message.value)

    console.log('status', status.value)

    messages.value.push({
      receiverId: '',
      senderId: user.value!.id,
      content: message.value,
      timestamp: new Date().toISOString(),
    })

    send(message.value)

    message.value = ''
  } else {
    console.log('not open')
  }
}

onBeforeUnmount(() => {
  close()
  isChatboxOpen.value = false
})
</script>

<!-- ChatSlideOver.vue -->
<template>
  <USlideover v-model="isChatboxOpen">
    <div class="flex flex-col h-full">
      <!-- Chat Header -->
      <div class="flex items-center p-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="rounded-full bg-blue-500 w-10 h-10 flex items-center justify-center text-white">
            {{ sellerName.charAt(0).toUpperCase() || 'G' }}
          </div>
          <div class="text-lg font-semibold">{{ sellerName || '' }}</div>
        </div>
        <button @click="isChatboxOpen = false" class="ml-auto text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div
          v-for="(messageObj, index) in messages"
          :key="index"
          :class="{
            'ml-auto': messageObj.senderId === user?.id,
            'mr-auto': messageObj.senderId !== user?.id,
          }"
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

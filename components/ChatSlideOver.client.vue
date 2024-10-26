<script setup lang="ts">
import type { UseWebSocketReturn } from '@vueuse/core'

const { sellerName, itemId } = defineProps<{ sellerName: string; itemId: string }>()

const isChatboxOpen = useState<boolean>('is-chatbox-open', () => false)

const conversationId = ref<string | null>(null)
const tempToken = ref<string | null>(null)
let chatConnection: UseWebSocketReturn<any> | null = null

const messages = ref<string[]>([])

watch(isChatboxOpen, async isOpen => {
  if (isOpen) {
    if (!conversationId.value) {
      try {
        const { conversationId: generatedConvId, tempToken: generatedTemptoken } = await $fetch(
          `/api/items/${itemId}/conversation`,
        )
        conversationId.value = generatedConvId
        tempToken.value = generatedTemptoken
      } catch (err) {
        console.log('Error on getting conversationId', err)
        useToast().add({ title: "Couldn't start the chat, please try again later or contact support", color: 'red' })
        isChatboxOpen.value = false
      }
    }

    setupChatConnection()
  } else {
    closeChatConnection()
  }
})

watch(
  () => chatConnection?.data,
  newData => {
    if (newData) {
      console.log('Received data:', newData)
      try {
        messages.value.push(newData as unknown as string)
      } catch (e) {
        console.error('Failed to parse message', e)
      }
    }
  },
)

function setupChatConnection() {
  if (conversationId.value && tempToken.value) {
    console.log('found conversationId and tempToken, setting up chat connection')

    chatConnection = useChatConnection(conversationId.value, tempToken.value, true)
    console.log('chatConnection', chatConnection)
  }
}

function closeChatConnection() {
  if (chatConnection) {
    chatConnection.close()
    chatConnection = null
  }
}

const message = ref('')

function sendData() {
  console.log('Sending message', message.value)

  if (message.value.trim() && chatConnection && chatConnection.status.value === 'OPEN') {
    console.log('open')
    console.log('message.value', message.value)

    console.log('status', chatConnection.status.value)
    console.log(chatConnection.send)

    chatConnection.send(message.value)

    message.value = ''
  } else {
    console.log('not open')
  }
}

onBeforeUnmount(() => {
  closeChatConnection()
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
          <div class="text-lg font-semibold">{{ sellerName || 'Garden Design' }}</div>
        </div>
        <button @click="isChatboxOpen = false" class="ml-auto text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <!-- <div
          v-for="(message, index) in messages"
          :key="index"
          :class="{
            'ml-auto': message.from === 'buyer',
            'mr-auto': message.from === 'seller',
          }"
          class="max-w-[75%]"
        >
          <div
            :class="[
              'relative px-4 py-2 rounded-lg',
              message.from === 'buyer' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800',
            ]"
            class="break-words"
          >
            <span>{{ message.text }}</span>
            <div
              :class="[
                'absolute bottom-0 h-4 w-4',
                message.from === 'buyer' ? 'right-0 -mr-2 bg-blue-500' : 'left-0 -ml-2 bg-gray-300',
              ]"
              :style="{
                clipPath: message.from === 'buyer' ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
              }"
            ></div>
          </div>
        </div> -->
        <p v-for="message in messages" :key="message">{{ message }}</p>
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

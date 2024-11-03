<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const { sellerName, itemId } = defineProps<{ sellerName: string; itemId: string }>()

const { t } = useI18n()
const isChatboxOpen = useChatboxState()
const { user } = useUserSession()

const conversationId = ref('')
const tempToken = ref('')
const messages = ref<MessageData[]>([])
const message = ref('')

// New loading state
const isLoading = ref(true)

// Fetch conversation data
const {
  data: conversationData,
  error: conversationError,
  status: conversationStatus,
} = await useFetch(`/api/items/${itemId}/conversation`)

if (!conversationData.value || conversationError.value) {
  useToast().add({ title: t("Couldn't load messages, please try again later or contact support"), color: 'red' })
  throw createError({ statusCode: 500, message: t("Couldn't load messages, please try again later or contact support") })
}

conversationId.value = conversationData.value.conversationId
tempToken.value = conversationData.value.tempToken

// Initialize chat connection
console.log('conversation id here in chat slide over', conversationId.value)

const {
  close: closeConnection,
  data: incomingData,
  send: sendMessage,
  status: connectionStatus,
} = useChatConnection<MessageData>(conversationId.value, tempToken.value, true)

// Fetch messages lazily
const {
  data: messagesData,
  error: messagesError,
  status: messagesStatus,
} = await useLazyFetch<{ statusCode: number; data: MessageData[] }>(`/api/messages/${conversationId.value}`)

// Variable to track if messages are loaded
const messagesLoaded = ref(false)
// Variable to track if the timer is completed
const timerCompleted = ref(false)

watch([messagesData, messagesError], ([dataValue, errorValue]) => {
  if (!dataValue || errorValue) {
    closeConnection()
    useToast().add({ title: t("Couldn't load messages, please try again later or contact support"), color: 'red' })
    return
  } else {
    console.log('back with the data')

    console.log('data value is', dataValue.data)
    messages.value = dataValue.data || []
    console.log('assigned messages', messages.value)

    messagesLoaded.value = true
    // If the timer is already completed, hide the loading spinner
    if (timerCompleted.value) {
      isLoading.value = false
    }
  }
})

watch(incomingData, newData => {
  try {
    let messageData: MessageData | undefined
    // Parse the incoming data as JSON
    if (typeof newData === 'string') {
      messageData = JSON.parse(newData)
    }

    if (messageData && messageData.senderId !== user.value!.id) {
      messages.value.push(messageData)
    }
  } catch (e) {
    console.error('Failed to parse message', e)
  }
})

function sendData() {
  if (message.value.trim() && connectionStatus.value === 'OPEN') {
    const newMessage: MessageData = {
      receiverId: '',
      senderId: user.value!.id,
      content: message.value,
      timestamp: new Date().toISOString(),
    }

    messages.value.push(newMessage)

    sendMessage(message.value)

    message.value = ''
  }
}

onMounted(() => {
  // Start a 2-second timer
  setTimeout(() => {
    timerCompleted.value = true
    // Check if messages are loaded
    if (messagesLoaded.value) {
      isLoading.value = false
    }
  }, 2000)
})

onBeforeUnmount(() => {
  closeConnection()
  isChatboxOpen.value = false
})
</script>

<template>
  <USlideover v-model="isChatboxOpen">
    <div v-if="messagesStatus === 'pending' || conversationStatus === 'pending' || connectionStatus !== 'OPEN' || isLoading">
      <UAlert :title="t('Loading messages...')" />
      <LoadingSpinner />
    </div>
    <div v-else class="flex flex-col h-full">
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
            :placeholder="t('Type your message...')"
            class="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
          />
          <button
            @click="sendData"
            class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
          >
            {{ t('Send') }}
          </button>
        </div>
      </div>
    </div>
  </USlideover>
</template>

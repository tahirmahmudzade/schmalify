<script setup lang="ts">
import type { Conversation } from '~/server/database/drizzle'

const { conversation } = defineProps<{ conversation: Conversation }>()

const emit = defineEmits(['closeChat'])

const { user } = useUserSession()

const messages = ref<MessageData[]>([])
const message = ref('')
const otherParticipantName = ref('')
const chatOpen = ref(true)

// Fetch messages for the selected conversation
const { data: messagesData, error: messagesError } = await useFetch<{ statusCode: number; data: MessageData[] }>(
  `/api/messages/${conversation.id}`,
)

if (messagesError.value || !messagesData.value) {
  throw createError({ statusCode: 404, message: 'Failed to load messages' })
}

messages.value = messagesData.value.data || []

// Fetch temp token for WebSocket connection
const { data: tempTokenData, error: temptokenError } = await useFetch(`/api/users/token`)

if (!tempTokenData.value || temptokenError.value) {
  throw createError({ statusCode: 404, message: 'Failed to load temp token' })
}

const tempToken = tempTokenData.value.tempToken

// Set up WebSocket connection
const { data: incomingMessageData, send, status, close } = useChatConnection(conversation.id, tempToken, true)

// Handle incoming messages
watch(incomingMessageData, (newData: string) => {
  try {
    const otherUserId = conversation.participants!.find(id => id !== user.value?.id) || ''
    messages.value.push({
      senderId: otherUserId,
      content: newData,
      receiverId: user.value!.id,
      timestamp: new Date().toISOString(),
    })
  } catch (e) {
    console.error('Failed to parse message', e)
  }
})

// Send message function
function sendData() {
  if (message.value.trim() && status.value === 'OPEN') {
    const msgObj = {
      senderId: user.value!.id,
      receiverId: conversation.participants!.find(id => id !== user.value?.id) || '',
      content: message.value,
      timestamp: new Date().toISOString(),
    }
    messages.value.push(msgObj)
    send(message.value)
    message.value = ''
  }
}

// Close chat function
function closeChat() {
  emit('closeChat')
  chatOpen.value = false
  close()
}

// Clean up WebSocket connection when component is unmounted

// Helper function to get the other participant's name
function getOtherParticipantName(participants: string[] = []) {
  const otherParticipantId = participants.find(id => id !== user.value?.id)
  if (!otherParticipantId) return 'Unknown'

  // Replace with your actual logic to fetch user data
  const otherUser = getUserById(otherParticipantId)
  return otherUser?.username || 'Unknown'
}

// Mock function to get user data; replace with actual API call or data source
function getUserById(userId: string) {
  // Implement your logic to fetch user data
  return { id: userId, username: 'User ' + userId.slice(-4) }
}

// Set the other participant's name
otherParticipantName.value = getOtherParticipantName(conversation.participants!)

onBeforeUnmount(() => {
  close()
})
</script>

<template>
  <USlideover v-model="chatOpen">
    <div class="flex flex-col h-full">
      <!-- Chat Header -->
      <div class="flex items-center p-4 border-b border-gray-200">
        <div class="flex items-center space-x-2">
          <div class="rounded-full bg-blue-500 w-10 h-10 flex items-center justify-center text-white">
            {{ 'G' }}
          </div>
          <div class="text-lg font-semibold">{{ 'hi' }}</div>
        </div>
        <button @click="closeChat()" class="ml-auto text-gray-500 hover:text-gray-700">✕</button>
      </div>

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

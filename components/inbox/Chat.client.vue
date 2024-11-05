<script setup lang="ts">
import type { Conversation } from '~/server/database/drizzle'

const { conversation } = defineProps<{ conversation: Conversation }>()

const emit = defineEmits(['closeChat'])

const messageStore = useMessageStore()

const { message, isChatOpen, allMessages } = storeToRefs(messageStore)

const { t } = useI18n()
const { user } = useUserSession()

const {
  data: messagesData,
  error: messagesError,
  status: messagesStatus,
} = await useLazyFetch<{ statusCode: number; data: MessageData[] }>(`/api/messages/${conversation.id}`)

watch([messagesData, messagesError], ([dataValue, errorValue]) => {
  if (!dataValue || errorValue) {
    closeChat()
    useToast().add({ title: t("Couldn't load messages, please try again later or contact support"), color: 'red' })
    return
  } else {
    allMessages.value = dataValue.data || []
  }
})

const { data: tempTokenData, error: temptokenError, status: temptokenStatus } = await useFetch(`/api/users/token`)

if (!tempTokenData.value || temptokenError.value) {
  throw createError({ statusCode: 404, message: 'Failed to load temp token' })
}

const { tempToken } = tempTokenData.value

const {
  data: incomingMessageData,
  send: sendMessage,
  status: connectionStatus,
  close: closeConnection,
} = useChatConnection<string>(conversation.id, tempToken, true)

watch(incomingMessageData, newData => {
  try {
    let messageData: MessageData | undefined
    // Parse the incoming data as JSON
    if (typeof newData === 'string') {
      messageData = JSON.parse(newData)
    }

    if (messageData && messageData.senderId !== user.value!.id) {
      allMessages.value.push(messageData)
    }
  } catch (e) {
    console.error('Failed to parse message', e)
  }
})

function sendData() {
  if (message.value.trim() && connectionStatus.value === 'OPEN') {
    const msgObj: MessageData = {
      senderId: user.value!.id,
      receiverId: conversation.participants!.find(id => id !== user.value?.id) || '',
      content: message.value,
      timestamp: new Date().toISOString(),
    }
    allMessages.value.push(msgObj)

    sendMessage(message.value)

    message.value = ''
  } else {
    useToast().add({ title: t('Failed to send message, please try again later or contact support'), color: 'red' })
  }
}

function closeChat() {
  isChatOpen.value = false
  closeConnection()
  setTimeout(() => emit('closeChat'), 500)
}
</script>

<template>
  <div>
    <USlideover v-model="isChatOpen" @after-leave="closeChat()">
      <div v-if="messagesStatus === 'pending' || temptokenStatus === 'pending' || connectionStatus !== 'OPEN'">
        <UAlert :title="t('Loading messages...')" />
        <LoadingSpinner />
      </div>
      <div v-else class="flex flex-col h-full">
        <ChatHeader />

        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <ChatBody />
        </div>

        <div class="p-4 border-t border-gray-200">
          <ChatFooter @send-message="sendData" />
        </div>
      </div>
    </USlideover>
  </div>
</template>

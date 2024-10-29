export const useMessageStore = defineStore('message-store', () => {
  const message = ref('')
  const isChatOpen = ref(false)
  const allMessages = ref<MessageData[]>([])

  return { message, isChatOpen, allMessages }
})

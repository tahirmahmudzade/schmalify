<script setup lang="ts">
const emits = defineEmits(['sendMessage'])

const { t } = useI18n()
const messageStore = useMessageStore()

const { message } = storeToRefs(messageStore)
</script>

<template>
  <div class="flex">
    <input
      v-model="message"
      @keyup.enter="emits('sendMessage')"
      type="text"
      :placeholder="t('Type your message...')"
      class="flex-1 p-2 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 text-gray-900"
    />
    <button
      @click="emits('sendMessage')"
      class="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
    >
      {{ t('Send') }}
    </button>
  </div>
</template>

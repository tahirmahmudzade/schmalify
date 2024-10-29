<script setup lang="ts">
const messageStore = useMessageStore()

const { isChatOpen } = storeToRefs(messageStore)
</script>

<template>
  <div class="flex items-center p-4 border-b border-gray-200">
    <div class="flex items-center space-x-2">
      <div class="rounded-full bg-blue-500 w-10 h-10 flex items-center justify-center text-white">
        {{ 'G' }}
      </div>
      <div class="text-lg font-semibold">{{ 'hi' }}</div>
    </div>
    <button @click="isChatOpen = false" class="ml-auto text-gray-500 hover:text-gray-700">✕</button>
  </div>
</template>

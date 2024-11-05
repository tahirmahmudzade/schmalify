<script setup lang="ts">
const { user } = useUserSession()
const messageStore = useMessageStore()

const { allMessages } = storeToRefs(messageStore)
</script>

<template>
  <div
    v-for="(messageObj, index) in allMessages"
    :key="index"
    :class="[
      messageObj.senderId === 'server' ? 'text-center' : messageObj.senderId === user?.id ? 'ml-auto' : 'mr-auto',
      'max-w-[75%]',
    ]"
  >
    <div
      :class="[
        'relative px-4 py-2 rounded-lg',
        messageObj.senderId === 'server'
          ? ''
          : messageObj.senderId === user?.id
            ? 'bg-blue-500 text-white'
            : 'bg-gray-300 text-gray-800',
      ]"
      class="break-words"
    >
      <span>{{ messageObj.content }}</span>

      <!-- Triangle arrow, hidden for system messages -->
      <div
        v-if="messageObj.senderId !== 'server'"
        :class="[
          'absolute bottom-0 h-4 w-4',
          messageObj.senderId === user?.id ? 'right-0 -mr-2 bg-blue-500' : 'left-0 -ml-2 bg-gray-300',
        ]"
        :style="{
          clipPath: messageObj.senderId === user?.id ? 'polygon(0 0, 100% 0, 0 100%)' : 'polygon(100% 0, 0 0, 100% 100%)',
        }"
      ></div>
    </div>
  </div>
</template>

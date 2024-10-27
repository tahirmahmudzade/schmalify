<script setup lang="ts">
import type { Conversation } from '~/server/database/drizzle'

const { conversation } = defineProps<{ conversation: Conversation }>()

// function getOtherParticipantName(participants: string[] = []) {
//   const otherParticipantId = participants.find(id => id !== user.value?.id)
//   if (!otherParticipantId) return 'Unknown'

//   // Replace with your actual logic to fetch user data
//   const otherUser = getUserById(otherParticipantId)
//   return otherUser?.username || 'Unknown'
// }
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">
      <!-- {{ getOtherParticipantName(conversation.participants!) }} -->
      testing
    </div>
    <span>{{ conversation.lastUpdated }}</span>
  </div>
  <p>hello</p>
  <p class="text-gray-400 dark:text-gray-500 line-clamp-1">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.
    Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris.
  </p>
</template>

<script setup lang="ts">
import type { Conversation } from '~/server/database/drizzle'

const { conversation } = defineProps<{ conversation: Conversation }>()

const formattedDate = computed(() => {
  const date = new Date(conversation.lastUpdated!)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
})
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-3">testing</div>
    <span>{{ formattedDate }}</span>
  </div>
  <p>hello</p>
  <p class="text-gray-400 dark:text-gray-500 line-clamp-1">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque.
    Duis vulputate commodo lectus, ac blandit elit tincidunt id. Sed rhoncus, tortor sed eleifend tristique, tortor mauris.
  </p>
</template>

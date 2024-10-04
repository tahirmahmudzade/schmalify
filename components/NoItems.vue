<script setup lang="ts">
const { title = 'No items listed here yet, click sell now to create your listing', subtitle = '' } = defineProps<{
  title?: string
  subtitle?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center py-10 text-white">
    <h2 class="text-xl md:text-2xl font-semibold">{{ title }}</h2>
    <p v-if="subtitle" class="text-base md:text-lg text-gray-400">{{ subtitle }}</p>
  </div>
</template>

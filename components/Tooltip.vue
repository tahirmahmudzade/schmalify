<script setup lang="ts">
const { text, duration } = defineProps<{ text: string; duration?: number }>()

const { t } = useI18n()

const isVisible = ref(true)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = false
  }, duration)
})
</script>

<template>
  <div
    v-if="isVisible"
    class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded px-2 py-1"
    style="white-space: nowrap"
  >
    {{ t(text) }}
    <div
      class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-700"
    ></div>
  </div>
</template>

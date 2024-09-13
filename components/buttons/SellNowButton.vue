<script setup lang="ts">
defineProps<{
  click: () => void
}>()
</script>

<template>
  <UButton
    label="Sell Now"
    icon="i-material-symbols-light-sell-outline-sharp"
    variant="solid"
    color="black"
    :ui="{
      color: {
        black: {
          solid: `text-gray-900 dark:text-gray-900 bg-gray-100 
          dark:bg-gray-100 hover:bg-gray-900 dark:hover:bg-black
          hover:text-gray-100 dark:hover:text-gray-100`,
        },
      },
    }"
    @click="click"
  />
</template>

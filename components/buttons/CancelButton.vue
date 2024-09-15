<script setup lang="ts">
defineProps<{
  click: () => void
}>()
</script>

<template>
  <UButton
    color="white"
    class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
    label="Cancel"
    :ui="{
      rounded: 'rounded-lg',

      color: {
        white: {
          solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600',
        },
      },
    }"
    @click="click"
  >
    <template #leading>
      <Icon
        name="i-material-symbols-cancel-outline"
        style="color: #ef4444"
        size="1.3em"
      />
    </template>
  </UButton>
</template>

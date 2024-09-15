<script setup lang="ts">
defineProps<{
  click: () => void
}>()
</script>

<template>
  <UButton
    label="Sell Now"
    variant="solid"
    color="black"
    size="xs"
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
  >
    <template #leading>
      <Icon name="i-ep-sell" size="1.3em" />
      <!-- Solves cloud flare UButton icon issue -->
    </template>
  </UButton>
</template>

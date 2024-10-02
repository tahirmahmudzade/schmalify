<script setup lang="ts">
defineProps<{ click: () => void }>()
</script>

<template>
  <UButton
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
      <Icon name="i-mdi-shopping-basket-plus-outline" size="1.3em" />
    </template>

    <span class="hidden md:inline">Sell Now</span>
  </UButton>
</template>

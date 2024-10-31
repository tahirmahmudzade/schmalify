<script setup lang="ts">
import type { ButtonSize } from '#ui/types'
const { buttonSize = 'xs', isLabelHidden = true } = defineProps<{
  buttonSize?: ButtonSize
  isLabelHidden?: boolean
  click: () => void
}>()

const { t } = useI18n()
</script>

<template>
  <UButton
    variant="solid"
    color="black"
    :size="buttonSize"
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

    <span :class="isLabelHidden ? 'hidden md:inline' : ''">{{ t('Sell Now') }}</span>
  </UButton>
</template>

<script setup lang="ts">
import type { ButtonColor } from '#ui/types'

const emits = defineEmits(['close', 'confirm'])

const {
  title = 'Alert',
  description = '',
  confirmLabel = 'Confirm',
  confirmColor = 'gray',
} = defineProps<{
  title: string
  description: string
  confirmLabel?: string
  confirmColor?: ButtonColor
}>()

const { t } = useI18n()
</script>

<template>
  <UModal :ui="{ container: 'flex min-h-full items-center justify-center text-center' }">
    <UCard class="p-6 text-center">
      <div class="text-yellow-500 text-5xl mb-4">
        <Icon name="i-material-symbols-warning-outline" size="4rem" />
      </div>
      <h3 class="text-xl font-semibold mb-2">{{ t(title) }}</h3>
      <p class="text-gray-700 dark:text-gray-400 mb-6">{{ t(description) }}</p>
      <div class="flex justify-center space-x-4">
        <UButton :label="t('Close')" color="gray" class="px-4 py-2 rounded-md" @click="emits('close')" />
        <UButton :label="t(confirmLabel)" :color="confirmColor" class="px-4 py-2 rounded-md" @click="emits('confirm')" />
      </div>
    </UCard>
  </UModal>
</template>

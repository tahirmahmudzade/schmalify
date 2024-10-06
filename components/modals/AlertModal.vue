<script setup lang="ts">
import type { ButtonColor } from '#ui/types'
const emits = defineEmits(['close'])
const {
  title = 'Alert',
  description = '',
  confirmLabel = 'Confirm',
  confirmColor = 'gray',
  confirmAction = () => {
    navigateTo('/')
  },
} = defineProps<{
  title: string
  description: string
  confirmLabel?: string
  confirmColor?: ButtonColor
  confirmAction?: () => void
}>()

function onClose() {
  emits('close')
}
</script>

<template>
  <UModal>
    <UCard class="p-6 text-center">
      <!-- Centered Alert Icon -->
      <div class="text-yellow-500 text-5xl mb-4">
        <Icon name="i-material-symbols-warning-outline" size="4rem" />
      </div>
      <!-- Title and Description -->
      <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-400 mb-6">{{ description }}</p>
      <!-- Close Button -->
      <div class="flex justify-center space-x-4">
        <UButton label="Close" color="gray" class="px-4 py-2 rounded-md" @click="onClose" />
        <UButton :label="confirmLabel" :color="confirmColor" class="px-4 py-2 rounded-md" @click="confirmAction()" />
      </div>
    </UCard>
  </UModal>
</template>

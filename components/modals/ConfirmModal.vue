<script setup lang="ts">
const { title = 'Confirm your action.', description = '' } = defineProps<{ title: string; description: string }>()

const emits = defineEmits(['close', 'confirm'])

const { t } = useI18n()

function onClose() {
  emits('close')
}

function onConfirm() {
  emits('confirm')
}
</script>

<template>
  <UModal :ui="{ container: 'flex min-h-full items-center justify-center text-center' }">
    <UCard class="p-6 text-center">
      <div class="text-red-500 text-5xl mb-4">
        <Icon name="i-material-symbols-cancel-outline" size="4rem" />
      </div>
      <h3 class="text-xl font-semibold mb-2">{{ t(title) }}</h3>
      <p class="text-gray-700 dark:text-gray-400 mb-6">{{ t(description) }}</p>
      <div class="flex justify-center space-x-4">
        <UButton :label="t('Cancel')" color="gray" class="px-4 py-2 rounded-md" @click="onClose" />
        <UButton
          :label="t('Delete')"
          class="dark:bg-red-500 dark:text-white px-4 py-2 rounded-md dark:hover:bg-red-600"
          @click="onConfirm"
        />
      </div>
    </UCard>
  </UModal>
</template>

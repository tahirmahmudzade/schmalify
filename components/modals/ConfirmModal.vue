<script setup lang="ts">
const emits = defineEmits(['close', 'confirm'])
const { title = 'Confirm your action.', description = '' } = defineProps<{ title: string; description: string }>()

function onClose() {
  emits('close')
}

function onConfirm() {
  emits('confirm')
}
</script>

<template>
  <UModal>
    <UCard class="p-6 text-center">
      <div class="text-red-500 text-5xl mb-4">
        <Icon name="i-material-symbols-cancel-outline" size="4rem" />
      </div>
      <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-400 mb-6">{{ description }}</p>
      <div class="flex justify-center space-x-4">
        <UButton label="Cancel" color="gray" class="px-4 py-2 rounded-md" @click="onClose" />
        <UButton
          label="Delete"
          class="dark:bg-red-500 dark:text-white px-4 py-2 rounded-md dark:hover:bg-red-600"
          @click="onConfirm"
        />
      </div>
    </UCard>
  </UModal>
</template>

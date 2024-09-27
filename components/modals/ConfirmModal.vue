<script setup lang="ts">
const emits = defineEmits(['close', 'confirm'])
const { title = 'Confirm your action.', description = '' } = defineProps<{
  title: string
  description: string
}>()

function onClose() {
  emits('close')
}

function onConfirm() {
  emits('confirm')
}
</script>

<template>
  <UModal>
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        {{ title }}
      </template>

      <p>{{ description }}</p>

      <template #footer>
        <UButton label="Confirm" @click="onConfirm" />
        <UButton label="Cancel" color="gray" @click="onClose" />
      </template>
    </UCard>
  </UModal>
</template>

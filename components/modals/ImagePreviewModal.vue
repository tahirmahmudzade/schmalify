<script setup lang="ts">
const { imageUrl } = defineProps<{ imageUrl: string }>()

const emit = defineEmits(['close'])

const closePreview = () => {
  emit('close')
}
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
    @click.self="closePreview"
  >
    <div class="relative max-w-4xl p-4">
      <button class="absolute top-3 right-6 text-white text-3xl cursor-pointer" @click="closePreview">&times;</button>
      <img :src="imageUrl" alt="Full size image" class="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  images,
  removable,
  type = 'arrows',
} = defineProps<{ images: string[]; removable?: boolean; type?: 'arrows' | 'indicators' }>()

const emit = defineEmits<{ (e: 'removeImage', index: number): void }>()

function removeImage(index: number) {
  emit('removeImage', index)
}
</script>

<template>
  <div>
    <UCarousel
      :items="images"
      :arrows="type === 'arrows'"
      :indicators="type === 'indicators'"
      :ui="{ item: 'basis-full' }"
      class="w-full rounded-lg overflow-hidden"
    >
      <template #default="{ item, index }">
        <div class="relative w-full">
          <img :src="item" alt="Item Image" class="w-full h-40 object-cover rounded-lg" />

          <!-- Update the @click handler here -->
          <button
            v-if="removable"
            class="absolute top-1 right-1 bg-gray-600 text-white rounded-full p-1 hover:bg-red-500 flex items-center justify-center"
            @click.stop.prevent="removeImage(index)"
            style="width: 24px; height: 24px"
          >
            <Icon name="mdi:close" class="w-3 h-3" />
          </button>
        </div>
      </template>
    </UCarousel>
  </div>
</template>

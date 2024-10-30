<script setup lang="ts">
const {
  images,
  removable,
  type = 'arrows',
} = defineProps<{ images: string[]; removable?: boolean; type?: 'arrows' | 'indicators' }>()

const emit = defineEmits<{ (e: 'removeImage', index: number): void }>()

function removeImage(event: Event, index: number) {
  event.stopPropagation() // Prevent click from bubbling up
  event.preventDefault() // Prevent default behavior of the click
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
      <template v-slot="{ item, index }">
        <div class="relative w-full">
          <img :src="item" alt="Item Image" class="w-full h-40 object-cover rounded-lg" />

          <!-- "X" icon for removing the image -->
          <button
            v-if="removable"
            class="absolute top-1 right-1 bg-gray-600 text-white rounded-full p-1 hover:bg-red-500 flex items-center justify-center"
            @click="event => removeImage(event, index)"
            style="width: 24px; height: 24px"
          >
            <Icon name="mdi:close" class="w-3 h-3" />
          </button>
        </div>
      </template>
    </UCarousel>
  </div>
</template>

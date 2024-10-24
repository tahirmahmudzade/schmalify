<script setup lang="ts">
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

const emits = defineEmits<{ (e: 'preview', imageUrl: string): void }>()

const { images } = defineProps<{ images: { id: number; name: string; src: string; alt: string }[] }>()
</script>

<template>
  <TabGroup as="div" class="flex flex-col-reverse lg:border-r lg:border-gray-200">
    <!-- Image selector -->
    <div class="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
      <TabList class="grid grid-cols-4 gap-6">
        <Tab
          v-for="image in images"
          :key="image.id"
          class="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
          v-slot="{ selected }"
        >
          <span class="sr-only">{{ image.name }}</span>
          <span class="absolute inset-0 overflow-hidden rounded-md">
            <img :src="image.src" alt="" class="h-full w-full object-cover object-center" />
          </span>
          <span
            :class="[
              selected ? 'ring-indigo-500' : 'ring-transparent',
              'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2',
            ]"
            aria-hidden="true"
          />
        </Tab>
      </TabList>
    </div>

    <!-- Adjusted TabPanels to enforce consistent image sizes -->
    <TabPanels>
      <TabPanel v-for="image in images" :key="image.id" class="w-full">
        <div class="relative h-96 w-full overflow-hidden rounded-lg">
          <img
            :src="image.src"
            :alt="image.alt"
            class="h-full w-full object-cover object-center"
            @click="emits('preview', image.src)"
          />
        </div>
      </TabPanel>
    </TabPanels>
  </TabGroup>
</template>

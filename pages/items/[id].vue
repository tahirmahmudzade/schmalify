<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFetch } from 'nuxt/app'
import { createError } from 'h3'
import type { Category, Item, User } from '~/server/database/drizzle'

const route = useRoute()

const isModalOpen = ref(false)

// Function to open the modal
function openModal() {
  isModalOpen.value = true
}

// Function to close the modal
function closeModal() {
  isModalOpen.value = false
}

const { data: itemData, error } = await useFetch<{
  statusCode: number
  item: Item & { category: Category | null; seller: User | null }
}>(`/api/items/${route.params.id}`)

if (error.value || !itemData.value) {
  throw createError({ statusCode: 404, message: 'Item might be already sold or removed, please check back later' })
}

const { item } = itemData.value

const whatsappLink = computed(() => {
  const phone = item.seller?.phone || ''
  const message = `Hi, I'm interested in your item "${item.title}". Is it still available?`

  // Ensure phone number is in international format without any special characters
  const formattedPhone = phone.replace(/[^0-9]/g, '')

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
})
</script>

<template>
  <div>
    <div class="flex justify-center p-4">
      <div
        class="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px]"
      >
        <div class="w-full md:w-1/2 h-64 md:h-[400px]">
          <!-- Make the image clickable -->
          <img
            :src="`/api/blob/${item.id}/serveImg`"
            alt="Item Image"
            class="w-full h-full object-cover cursor-pointer"
            @click="openModal"
          />
        </div>

        <!-- Item Info -->
        <div class="w-full md:w-1/2 p-6 flex flex-col justify-between">
          <!-- UBlogPost Component -->
          <UBlogPost
            :title="item.title"
            :description="item.description || ''"
            :date="item.seller?.username || `${item.seller?.firstName} ${item.seller?.lastName}`"
            orientation="horizontal"
            :authors="[
              {
                name: item.seller?.username || `${item.seller?.firstName} ${item.seller?.lastName}`,
                avatar: { src: getProfilePicUrl(item.seller?.avatar, item.seller_id), size: 'lg' },
              },
            ]"
            :ui="{
              title:
                'text-gray-900 dark:text-gray-900 text-xl font-semibold truncate group-hover:text-gray-900 dark:group-hover:text-gray-900',
              description: 'text-base text-gray-700 dark:text-gray-700 mt-1',
            }"
          >
            <template #badge>
              <div class="flex justify-between">
                <UBadge :label="formatDateToDDMMYYYY(item.createdAt!)" size="lg" variant="soft" color="sky" />
                <UButton
                  :label="item.category?.name"
                  variant="solid"
                  color="emerald"
                  class="dark:text-white"
                  :to="`/categories/${item.category?.name.toLowerCase().trim()}`"
                />
              </div>
            </template>
          </UBlogPost>

          <!-- Item Details -->
          <div class="mt-4 space-y-2">
            <div class="flex items-center">
              <Icon name="mdi:hammer-wrench" class="text-blue-500 mr-2" />
              <span class="font-semibold text-gray-700">Condition:</span>
              <span class="ml-1 text-gray-600">{{ item.condition }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="mdi:map-marker" class="text-red-500 mr-2" />
              <span class="font-semibold text-gray-700">Location:</span>
              <span class="ml-1 text-gray-600">{{ item.seller?.location || 'Not specified' }}</span>
            </div>
          </div>

          <!-- Contact Seller Button -->
          <div class="mt-6 flex justify-end">
            <a :href="whatsappLink" target="_blank">
              <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
                Contact Seller
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      @click.self="closeModal"
    >
      <div class="relative">
        <img
          :src="`/api/blob/${item.id}/serveImg`"
          alt="Item Image Full Screen"
          class="w-auto h-auto max-w-[80vw] max-h-[80vh]"
        />
        <!-- Close Button -->
        <button @click="closeModal" class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2">
          <Icon name="mdi:close" class="w-6 h-6" />
        </button>
      </div>
    </div>
  </div>
</template>

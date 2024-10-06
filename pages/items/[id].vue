<script setup lang="ts">
import type { Category, Item, User } from '~/server/database/drizzle'

const route = useRoute('items-id')

const isModalOpen = ref(false)

function openModal() {
  isModalOpen.value = true
}

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

  const formattedPhone = phone.replace(/[^0-9]/g, '')

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
})
</script>

<template>
  <div>
    <div class="flex justify-center p-4">
      <div
        class="w-full max-w-5xl bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row h-auto md:h-[400px] relative"
      >
        <div class="w-full md:w-1/2 h-64 md:h-[400px] relative">
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
                <UBadge :label="formatDateToDDMMYYYY(item.createdAt!)" size="lg" variant="outline" color="orange" />
                <UButton
                  v-if="item.category"
                  :label="item.category?.name"
                  variant="solid"
                  color="green"
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
              <span class="font-semibold text-gray-700">Address:</span>
              <span class="ml-1 text-gray-600">{{ item.seller?.location || 'Not specified' }}</span>
            </div>
            <div class="flex items-center">
              <Icon name="i-entypo-price-tag" class="text-green-500 mr-2" />
              <span class="font-semibold text-gray-700">Price:</span>
              <span class="ml-1 text-gray-600">{{ item.price }} €</span>
            </div>
          </div>

          <!-- Conditional "Sold" or "Contact Seller" Button -->
          <div class="mt-6 flex justify-end">
            <template v-if="item.status === 'sold'">
              <!-- Sold Button (disabled to indicate item is sold) -->
              <button class="bg-red-500 cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg opacity-50">
                This item is sold
              </button>
            </template>
            <template v-else>
              <!-- Contact Seller Button -->
              <a :href="whatsappLink" target="_blank">
                <button class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg">
                  Contact Seller
                </button>
              </a>
            </template>
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

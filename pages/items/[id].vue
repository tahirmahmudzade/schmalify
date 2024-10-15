<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { Category, Item, User } from '~/server/database/drizzle'

const route = useRoute('items-id')

const isModalOpen = ref(false)

const { data: itemData, error } = await useFetch<{
  statusCode: number
  item: Item & { category: Category | null; seller: User | null }
}>(`/api/items/${route.params.id}`)

if (error.value || !itemData.value) {
  throw createError({
    statusCode: 404,
    message: 'Item might be already sold or removed, please check back later',
  })
}

const { item } = itemData.value

const imagesUrl = item.images?.map(image => `/api/blob/${item.id}/serveImg?fileName=${image}`) || []

const product = reactive({
  name: item.title,
  price: item.price + ' €',
  rating: 0, // Assuming no rating available
  images: imagesUrl.map((url, index) => ({
    id: index,
    name: `Image ${index + 1}`,
    src: url,
    alt: `Image ${index + 1} of ${item.title}`,
  })),
  description: item.description || '',
  condition: item.condition || 'Not specified',
  location: item.seller?.location || 'Not specified',
  postedOn: formatDateToDDMMYYYY(item.createdAt!),
})

const whatsappLink = computed(() => {
  const phone = item.seller?.phone || ''
  const message = `Hi, I'm interested in your item "${item.title}". Is it still available?`

  const formattedPhone = phone.replace(/[^0-9]/g, '')

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`
})
</script>

<template>
  <div class="min-h-screen py-8">
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Main container with rounded corners and background -->
      <div class="bg-white rounded-lg shadow-lg p-8 lg:grid lg:grid-cols-2 lg:gap-x-8">
        <!-- Image gallery with border on the left -->
        <TabGroup as="div" class="flex flex-col-reverse lg:border-r lg:border-gray-200">
          <!-- Image selector -->
          <div class="mx-auto mt-6 w-full max-w-2xl lg:max-w-none">
            <TabList class="grid grid-cols-4 gap-6">
              <Tab
                v-for="image in product.images"
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
            <TabPanel v-for="image in product.images" :key="image.id" class="w-full">
              <div class="relative h-96 w-full overflow-hidden rounded-lg">
                <img :src="image.src" :alt="image.alt" class="h-full w-full object-cover object-center" />
              </div>
            </TabPanel>
          </TabPanels>
        </TabGroup>

        <!-- Product info -->
        <div class="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 lg:pl-8">
          <div class="flex justify-between items-center">
            <!-- Product Title -->
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">
              {{ product.name }}
            </h1>

            <!-- Category Link -->
            <a
              :href="`/category/${item.category.name}`"
              class="text-blue-600 hover:underline text-sm font-medium"
              v-if="item.category"
            >
              {{ item.category.name }}
            </a>
          </div>

          <div class="mt-3 flex items-center">
            <Icon name="i-entypo-price-tag" class="text-green-500 mr-2" size="1.5rem" />
            <p class="text-3xl tracking-tight text-gray-900">
              {{ product.price }}
            </p>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <h3 class="sr-only">Description</h3>

            <div class="space-y-6 text-base text-gray-700" v-html="product.description" />
          </div>

          <div class="mt-6 flex items-center">
            <UAvatar
              :src="getProfilePicUrl(item.seller?.avatar, item.seller_id)"
              alt="Avatar"
              size="md"
              class="w-10 h-10 rounded-full"
            />
            <p class="ml-2 text-md text-gray-500 italic">{{ item.seller?.username }}</p>
          </div>

          <!-- Details -->
          <div class="mt-6">
            <ul class="mt-2 text-base text-gray-700 space-y-1">
              <li class="flex items-center">
                <Icon name="mdi:hammer-wrench" class="text-blue-500 mr-2" />
                <strong>Condition:</strong>
                <span class="ml-2">{{ product.condition }}</span>
              </li>
              <li class="flex items-center">
                <Icon name="mdi:map-marker" class="text-red-500 mr-2" />
                <strong>Location:</strong>
                <span class="ml-2">{{ product.location }}</span>
              </li>
              <li class="flex items-center">
                <Icon name="mdi:calendar" class="text-yellow-500 mr-2" />
                <strong>Posted on:</strong>
                <span class="ml-2">{{ product.postedOn }}</span>
              </li>
            </ul>
          </div>

          <!-- Contact Seller Button -->
          <div class="mt-10 flex">
            <template v-if="item.status === 'sold'">
              <button
                type="button"
                class="flex max-w-xs flex-1 items-center justify-center rounded-md bg-red-500 px-8 py-3 text-base font-medium text-white opacity-50 cursor-not-allowed sm:w-full"
              >
                This item is sold
              </button>
            </template>
            <template v-else>
              <a
                :href="whatsappLink"
                target="_blank"
                class="flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-blue-500 px-8 py-3 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
              >
                Contact Seller
              </a>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

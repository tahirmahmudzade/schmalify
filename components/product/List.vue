<script setup lang="ts">
import type { Item } from '~/server/database/drizzle'

const { limit = 20 } = defineProps<{ limit?: number }>()

const offset = ref(0)
const items = ref<(Item & { seller: { avatar: string | null; location: string | null } | null })[]>([])
const loadingMore = ref(false)
const hasMoreItems = ref(true)
const error = ref()

const loadItems = async () => {
  try {
    loadingMore.value = true
    const { data, error: fetchError } = await useFetch('/api/items', { query: { limit, offset: offset.value } })
    if (fetchError.value) {
      error.value = fetchError.value
      hasMoreItems.value = false
      return
    }
    if (data.value && data.value.length > 0) {
      items.value = items.value.concat(data.value)
      offset.value += data.value.length // Increase offset by the actual number of items received

      // If the number of items received is less than the limit, we've reached the end
      if (data.value.length < limit) {
        hasMoreItems.value = false
      }
    } else {
      hasMoreItems.value = false
    }
  } catch (e) {
    error.value = e
    console.error('Error loading items:', e)
  } finally {
    loadingMore.value = false
  }
}

// Initial load
await loadItems()

// Infinite Scrolling using Scroll Event Listener
const scrollContainer = ref(null)

const handleScroll = () => {
  if (loadingMore.value || !hasMoreItems.value) return

  const scrollElement = scrollContainer.value
  if (!scrollElement) return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const fullHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight + 100 >= fullHeight) {
    // User is near the bottom of the page, load more items
    loadItems()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div>
    <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8" ref="scrollContainer">
      <div class="md:flex md:items-center md:justify-between">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900">All Products</h2>
        <!-- Optionally, add a link or additional content here -->
      </div>

      <!-- Products Grid -->
      <div v-if="items && items.length" class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
        <div v-for="item in items" :key="item.id" class="group relative">
          <div class="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
            <img
              :src="`/api/blob/${item.id}/serveImg` || 'img/items/default-item.webp'"
              :alt="item.title"
              class="h-full w-full object-cover object-center"
            />
          </div>
          <h3 class="mt-4 text-sm text-gray-100">
            <NuxtLink :to="`/items/${item.id}`">
              <span class="absolute inset-0"></span>
              {{ item.title }}
            </NuxtLink>
          </h3>
          <p class="mt-1 text-sm font-medium text-green-500">${{ item.price }}</p>
          <p class="mt-1 text-sm text-orange-500">{{ formatDateToDDMMYYYY(item.createdAt!) || '' }}</p>
        </div>
      </div>

      <!-- No Products Message -->
      <div v-else-if="!loadingMore && !error" class="mt-6 text-center text-gray-500">No products available.</div>

      <!-- Loading and Error Messages -->
      <div v-if="loadingMore" class="text-center py-10">
        <p>Loading products...</p>
      </div>
      <div v-if="error" class="text-center py-10 text-red-500">
        <p>{{ error.message }}</p>
      </div>
    </div>
  </div>
</template>

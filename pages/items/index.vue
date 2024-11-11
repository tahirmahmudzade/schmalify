<script setup lang="ts">
import type { Item } from '~/server/database/drizzle'

useSeoMeta({
  title: `All Items`,
  description: () => `Discover the best items`,
  ogTitle: () => `All Items`,
  ogDescription: () => `Discover the best items`,
  ogImage: () => `/img/external-logo.png`,
  ogUrl: () => `${canonicalUrl}/items`,
  ogType: 'website',
})

const { data: categoryData } = useFetch('/api/category')

const { t } = useI18n()
const itemStore = useItemStore()
const { filterItems } = itemStore

const limit = 16
const offset = ref(0)
const items = ref<(Item & { seller: { avatar: string | null; location: string | null } | null })[]>([])
const loadingMore = ref(false)
const hasMoreItems = ref(true)

const loadItems = async () => {
  try {
    loadingMore.value = true
    const data = await $fetch('/api/items', { query: { limit, offset: offset.value } })

    if (data && data.length > 0) {
      items.value = items.value.concat(data)
      offset.value += data.length

      // If fewer items than the limit are returned, stop loading more
      if (data.length < limit) {
        hasMoreItems.value = false
      }
    } else {
      hasMoreItems.value = false
    }
  } catch (e) {
    console.error('Error loading items:', e)
    throw createError({ statusCode: 500, message: t('Something went wrong, please try again later or contact support.') })
  } finally {
    loadingMore.value = false
  }
}

// Initial load
await loadItems()

// Apply filters and sorting from the store
const filteredItems = computed(() => {
  return filterItems(items.value)
})

// Use infinite scroll composable (pass the refs for reactivity)
useInfiniteScroll(loadItems, loadingMore, hasMoreItems)
</script>

<template>
  <div>
    <ProductFilter :categories="categoryData?.categories" />
    <ProductList :items="filteredItems" :limit="limit" />
  </div>
</template>

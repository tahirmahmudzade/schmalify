<script lang="ts">
import type { Item } from '~/server/database/drizzle'
</script>

<script setup lang="ts">
const { items } = defineProps<{ items: (Item & { seller?: { avatar: string | null; location: string | null } | null })[] }>()

const { resetFilters } = useItemStore()
const { t } = useI18n()

onBeforeUnmount(() => {
  resetFilters()
})
</script>

<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
    <!-- Products Grid -->
    <div v-if="items && items.length" class="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 lg:gap-x-8">
      <div v-for="item in items" :key="item.id" class="group relative">
        <!-- Badge for Sold Items -->
        <div v-if="item.status === 'sold'" class="absolute top-2 right-2" style="z-index: 5">
          <LazyUBadge :label="t('Sold')" color="red" size="md" />
        </div>
        <!-- Item Image -->
        <div class="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80 relative">
          <img
            :src="`/api/blob/${item.id}/serveImg?fileName=${item.images![0]}`"
            :alt="item.title"
            class="h-full w-full object-cover object-center"
            @error="event => handleImageError(event, 'item')"
          />
        </div>
        <!-- Item Details -->
        <h3 class="mt-4 text-sm text-gray-900 dark:text-gray-100">
          <NuxtLink :to="`/items/${item.id}`">
            <span class="absolute inset-0"></span>
            {{ item.title }}
          </NuxtLink>
        </h3>
        <p class="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">€{{ item.price }}</p>
        <p class="mt-1 text-sm text-gray-900 dark:text-gray-100">{{ formatDateToDDMMYYYY(item.createdAt!) || '' }}</p>
      </div>
    </div>

    <!-- No Products Message -->
    <NoItems :show-recommendations="true" v-else />
  </div>
</template>

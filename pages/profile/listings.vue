<script lang="ts">
import type { Item } from '~/server/database/drizzle'
</script>

<script setup lang="ts">
const { t } = useI18n()
const toast = useToast()
const { data: itemsData, error: getItemsError, refresh: refreshItems } = await useMyItems()
const { data: categoryData } = await useFetch(`/api/category`)
const { filterItems } = useItemStore()

if (!itemsData.value && getItemsError.value) {
  throw createError({ statusCode: 500, message: t('Something went wrong, please try again later or contact support.') })
}

const filteredItems = computed(() => {
  return filterItems(itemsData.value)
})

function handleEdit(item: Item & { category?: { name: string } | null }) {
  try {
    useEditItem(item, refreshItems)
  } catch (err: any) {
    console.log('Error editing item:', err)
    toast.add({ title: err.data.message || t('Something went wrong, please try again later or contact support.') })
  }
}

function handleDelete(itemId: string) {
  try {
    useDeleteItem(itemId, refreshItems)
  } catch (err: any) {
    console.log('Error deleting item:', err)
    toast.add({ title: err.data.message || t('Something went wrong, please try again later or contact support.') })
  }
}
</script>

<template>
  <div class="container mx-auto">
    <ProductFilter :categories="categoryData?.categories" :title="t('My Listings')" description="" />
    <!-- Items Section -->
    <div class="px-4 py-8">
      <div
        v-if="itemsData.length"
        class="grid gap-4 grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-fr lg:overflow-x-auto lg:overflow-y-hidden"
      >
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="relative rounded-lg overflow-hidden shadow-md bg-white/5 backdrop-blur-[10px] border border-white/10 transition-transform duration-200 ease-in-out flex flex-col hover:-translate-y-1 cursor-pointer"
          @click="navigateTo(`/items/${item.id}`)"
        >
          <!-- Sold Badge -->
          <UBadge
            v-if="item.status === 'sold'"
            :label="t('Sold')"
            color="red"
            size="md"
            class="absolute top-2 right-2 z-10 font-bold"
          />

          <!-- Item Image -->
          <img
            v-if="item.images && item.images.length"
            :src="`/api/blob/${item.id}/serveImg?fileName=${item.images![0]}`"
            loading="lazy"
            :alt="item.title"
            class="w-full h-[180px] object-cover"
          />

          <!-- Default Image if no images -->
          <img v-else src="/img/items/default-item.webp" alt="Default Image" class="w-full h-[180px] object-cover" />

          <!-- Item Details -->
          <div class="p-4 flex flex-col justify-between flex-grow">
            <!-- Title and Price -->
            <div>
              <h3 class="text-gray-800 dark:text-gray-100 font-semibold text-sm mb-2 text-left break-words">
                {{ item.title }}
              </h3>
              <p class="text-gray-700 dark:text-gray-300 text-xs mb-1 text-left break-words">
                {{ t('Price') }}: {{ item.price }}
              </p>
              <p class="text-gray-700 dark:text-gray-300 text-xs mb-1 text-left break-words">
                {{ t('Condition') }}: {{ t(formatCondition(item.condition as Condition)) }}
              </p>
              <p class="text-gray-700 dark:text-gray-300 text-xs text-left break-words">
                {{ t('Posted on') }}: {{ formatDateToDDMMYYYY(item.createdAt!) }}
              </p>
            </div>

            <!-- Edit and Delete Buttons at the Bottom -->
            <div class="mt-4 flex flex-col space-y-2">
              <!-- Edit Button -->
              <button
                class="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-transform duration-200 w-full"
                @click.stop="handleEdit(item)"
              >
                <span
                  class="text-white text-xs flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r drop-shadow-lg"
                >
                  {{ t('Edit') }}
                </span>
              </button>

              <!-- Delete Button Styled Like Edit -->
              <button
                class="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full hover:from-red-600 hover:to-red-700 shadow-lg transform hover:scale-105 transition-transform duration-200 w-full"
                @click.stop="handleDelete(item.id)"
              >
                <span
                  class="text-white text-xs flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r drop-shadow-lg"
                >
                  {{ t('Delete') }}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <NoItems :show-recommendations="true" v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from '~/server/database/drizzle'

const toast = useToast()
const { data: itemsData, error: getItemsError, refresh: refreshItems } = await useMyItems()

if (!itemsData.value && getItemsError.value) {
  throw createError({ statusCode: 500, message: 'Something went wrong, please try again later.' })
}

function handleEdit(item: Item & { category: { name: string } | null }) {
  try {
    useEditItem(item, refreshItems)
  } catch (err) {
    console.log('Error editing item:', err)
    toast.add({ title: 'Something went wrong, please try again later or contact support.' })
  }
}

function handleDelete(itemId: string) {
  try {
    useDeleteItem(itemId, refreshItems)
  } catch (err) {
    console.log('Error deleting item:', err)
    toast.add({ title: 'Something went wrong, please try again later or contact support.' })
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Items Section -->
    <div class="items-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center">Your Listings</h2>
      <div
        class="grid gap-4 grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-fr lg:overflow-x-auto lg:overflow-y-hidden"
      >
        <div
          v-for="item in itemsData"
          :key="item.id"
          class="relative rounded-lg overflow-hidden shadow-md bg-white/5 backdrop-blur-[10px] border border-white/10 transition-transform duration-200 ease-in-out flex flex-col hover:-translate-y-1 cursor-pointer"
          @click="navigateTo(`/items/${item.id}`)"
        >
          <!-- Delete Icon in Top Right -->
          <UButton
            class="absolute top-2 right-2 dark:bg-red-600 hover:dark:bg-white dark:text-white hover:dark:text-red-500 transition duration-200 z-10"
            @click.stop="handleDelete(item.id)"
          >
            <Icon name="i-material-symbols-delete-outline" size="1rem" />
          </UButton>

          <!-- Item Image -->
          <img
            :src="`/api/items/${item.id}/serveImg`"
            loading="lazy"
            :alt="item.title"
            class="w-full h-[180px] object-cover"
          />

          <!-- Item Details -->
          <div class="p-4 flex flex-col justify-between flex-grow">
            <!-- Title and Price -->
            <div>
              <h3 class="text-gray-100 font-semibold text-sm mb-2 text-left break-words">
                {{ item.title }}
              </h3>
              <p class="text-gray-300 text-xs mb-1 text-left break-words">Price: {{ item.price }}</p>
              <p class="text-gray-400 text-xs text-left break-words">{{ item.description }}</p>
            </div>

            <!-- Edit Button at the Bottom -->
            <button
              class="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full hover:from-blue-600 hover:to-purple-700 shadow-lg transform hover:scale-105 transition-transform duration-200 w-full"
              @click.stop="handleEdit(item)"
            >
              <span
                class="text-white text-sm flex items-center justify-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r drop-shadow-lg"
              >
                Edit
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toast = useToast()
const { user } = useUserSession()

const { data: itemsData, error: getItemsError } = await useFetch(`/api/users/${user.value?.id}/myItems`)

if (!itemsData.value && getItemsError.value) {
  throw createError({ statusCode: 500, message: 'Something went wrong, please try again later.' })
}
</script>

<template>
  <div class="max-w-[1200px] mx-auto px-4 py-8">
    <!-- Items Section -->
    <div class="items-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center">Your Listings</h2>
      <div
        class="items-container grid grid-cols-2 gap-4 lg:grid-flow-col lg:grid-rows-2 lg:auto-cols-[minmax(200px,1fr)] lg:overflow-x-auto lg:overflow-y-hidden"
      >
        <div
          v-for="item in itemsData"
          :key="item.id"
          class="item-card rounded-lg overflow-hidden shadow-md cursor-pointer bg-white/5 backdrop-blur-[10px] border border-white/10 transform transition-transform duration-200 ease-in-out flex flex-col h-full hover:-translate-y-[5px]"
          @click="navigateTo(`/items/${item.id}`)"
        >
          <img :src="`/api/items/${item.id}/serveImg`" :alt="item.title" class="item-image w-full h-[180px] object-cover" />
          <div class="p-4 flex flex-col flex-1">
            <h3 class="text-gray-300 font-semibold text-sm mb-2 text-left break-words">
              {{ item.title }}
            </h3>
            <p class="text-gray-400 text-xs mb-1 text-left break-words">Price: {{ item.price }}</p>
            <p class="text-gray-400 text-xs mb-1 text-left break-words">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

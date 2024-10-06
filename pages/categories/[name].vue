<script setup lang="ts">
const route = useRoute('categories-name')
const { data: categoryData, error } = await useFetch(`/api/category/${route.params.name}`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    message: 'Category not found or another error occurred, please try again later or contact support.',
  })
}

const category = categoryData.value!.category
const items = categoryData.value!.category.items
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Category Details Section -->
    <div class="text-center mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
        {{ category.name }}
      </h1>
    </div>

    <!-- Items Section -->
    <div v-if="items.length" class="items-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4">Items in {{ category.name }}</h2>
      <div
        class="grid gap-4 grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 lg:auto-rows-fr lg:overflow-x-auto lg:overflow-y-hidden"
      >
        <!-- Reusing the item card design from /profile/listings -->
        <div
          v-for="item in items"
          :key="item.id"
          class="relative rounded-lg overflow-hidden shadow-md bg-white/5 backdrop-blur-lg border border-white/10 transition-transform duration-200 ease-in-out flex flex-col hover:-translate-y-1 cursor-pointer"
          @click="navigateTo(`/items/${item.id}`)"
        >
          <!-- Sold Badge -->
          <UBadge
            v-if="item.status === 'sold'"
            label="Sold"
            color="red"
            size="md"
            class="absolute top-2 right-2 z-10 font-bold"
          />

          <!-- Item Image -->
          <img
            :src="`/api/blob/${item.id}/serveImg`"
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
              <p class="text-gray-300 text-xs mb-1 text-left break-words">Price: {{ item.price }}€</p>
              <p class="text-gray-400 text-xs mb-1 text-left break-words">Condition: {{ item.condition }}</p>
              <p class="text-gray-400 text-xs text-left break-words">{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NoItems v-else :title="`No items found in ${category.name}, check back later for more items!`" />
  </div>
</template>

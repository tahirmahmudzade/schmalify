<script setup lang="ts">
const route = useRoute('categories-name')
const { data: categoryData, error } = await useFetch(`/api/category/${route.params.name}`)

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500, // Use the actual status code or fallback to 500
    message: 'Category not found or another error occurred, please try again later or contact support.',
  })
}

const category = categoryData.value!.category
const items = categoryData.value!.category.items
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Category Details Section -->
    <div class="category-header text-center mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
        {{ category.name }}
      </h1>
    </div>

    <!-- Items Section -->
    <div v-if="category.items.length" class="items-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4">Items in {{ category.name }}</h2>
      <div class="items-container">
        <div
          v-for="item in items"
          :key="item.id"
          class="item-card rounded-lg overflow-hidden shadow-md cursor-pointer"
          @click="navigateTo(`/items/${item.id}`)"
        >
          <img
            :src="`/api/blob/${item.id}/serveImg`"
            :alt="item.title"
            loading="lazy"
            class="item-image w-full object-cover"
          />
          <div class="p-4">
            <h3 class="text-gray-100 font-semibold text-sm mb-2">{{ item.title }}</h3>
            <p class="text-gray-300 text-xs mb-1">Price: {{ item.price }}€</p>
            <p class="text-gray-400 text-xs mb-1">{{ item.condition }} condition</p>
            <p class="text-gray-400 text-xs">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
    <NoItems v-else :title="`No items found in ${category.name}, check back later for more items!`" />
  </div>
</template>

<style scoped>
/* General container styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Category Header */
.category-header {
  margin-bottom: 2rem;
}

.category-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
}

.category-header p {
  font-size: 1.125rem;
  color: #a0aec0;
}

/* Items Section */
.items-container {
  display: grid;
  gap: 1rem; /* Spacing between items */
}

/* Mobile devices: Vertically scrollable grid with 2 columns */
@media (max-width: 1023px) {
  .items-container {
    grid-template-columns: repeat(2, minmax(0, 1fr)); /* Two columns with equal width */
  }
}

/* Desktop devices: Horizontally scrollable grid with 4 columns and 2 rows */
@media (min-width: 1024px) {
  .items-container {
    grid-auto-flow: column; /* Arrange items in columns */
    grid-template-rows: repeat(2, auto); /* Two rows */
    grid-auto-columns: minmax(200px, 1fr); /* Set minimum column width */
    overflow-x: auto; /* Enable horizontal scrolling */
    overflow-y: hidden; /* Prevent vertical scrolling */
  }

  /* Scrollbar styling for horizontal scrolling */
  .items-container::-webkit-scrollbar {
    height: 6px;
  }

  .items-container::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
}

/* Item Card Styling */
.item-card {
  background-color: rgba(255, 255, 255, 0.05); /* Semi-transparent dark background */
  backdrop-filter: blur(10px); /* Blur effect for smoothness */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  transition: transform 0.2s ease-in-out; /* Animation for hover effect */
  display: flex;
  flex-direction: column;
  height: 100%;
}

.item-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
}

.item-image {
  width: 100%;
  height: 180px; /* Adjusted height */
  object-fit: cover;
}

.item-card .p-4 {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.item-card h3,
.item-card p {
  text-align: left;
  word-break: break-word; /* Ensure long text wraps */
}

.item-card h3 {
  margin-bottom: 0.5rem;
}

.item-card p {
  margin-bottom: 0.25rem;
}

/* Text Styling */
.item-card h3 {
  color: #e2e8f0;
}

.item-card p {
  color: #a0aec0; /* Adjusted text color for better contrast */
}
</style>

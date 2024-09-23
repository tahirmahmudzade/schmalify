<script setup lang="ts">
const toast = useToast()
const { user } = useUserSession()

const { data: itemsData, error: getItemsError } = await useFetch(`/api/users/${user.value?.id}/myItems`)

if (!itemsData.value && getItemsError.value) {
  toast.add({ color: 'red', title: 'Something went wrong, please try again later.' })
  setTimeout(() => reloadNuxtApp({ path: '/' }), 2000)
  throw createError({ statusCode: 500, message: 'Something went wrong, please try again later.' })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Items Section -->
    <div class="items-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center">Your Listings</h2>
      <div class="items-container">
        <div v-for="item in itemsData" :key="item.id" class="item-card rounded-lg overflow-hidden shadow-md">
          <img :src="`/api/items/${item.id}/serveImg`" :alt="item.title" class="item-image w-full object-cover" />
          <div class="p-4">
            <h3 class="text-gray-100 font-semibold text-sm mb-2">{{ item.title }}</h3>
            <p class="text-gray-300 text-xs mb-1">Price: {{ item.price }}</p>
            <p class="text-gray-400 text-xs">{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

/* Base styles for the items container */
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

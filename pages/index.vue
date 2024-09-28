<script setup lang="ts">
import type { Category, Item } from '~/server/database/drizzle'

const { data: categoryRes } = await useFetch('/api/category')
const { data: itemRes } = await useFetch('/api/items')

const categories = ref<Category[]>([])
const items = ref<(Item & { seller: { location: string | null } | null })[]>([])

if (categoryRes.value) {
  categories.value = categoryRes.value.categories
}

if (itemRes.value) {
  items.value = itemRes.value.items
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
        Swap or Sell, Do It Well! - Student Deals in Schmalkalden!
      </h1>
      <p class="text-gray-400 dark:text-gray-400 mt-2 text-sm sm:text-base lg:text-lg">
        Discover great deals and unique items for sale near you
      </p>

      <!-- Search Bar -->
      <div class="mt-6 relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg">
        <input
          type="text"
          placeholder="What are you looking for?"
          class="w-full py-3 pl-4 pr-10 rounded-full bg-gray-100 text-gray-900 focus:outline-none"
        />
        <button class="absolute right-0 top-0 mt-2 mr-4 text-gray-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35m1.86-5.86a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- Categories Section -->
    <div class="category-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center">Categories</h2>
      <div class="categories-container">
        <NuxtLink
          v-for="category in categories"
          :to="`/categories/${category.name.toLowerCase().trim()}`"
          :key="category.name"
          class="category-card flex flex-col items-center p-4 rounded-lg shadow-md"
        >
          <NuxtImg
            :src="`/img/categories/${category.img!}`"
            :alt="category.name"
            class="category-image w-full object-cover"
            format="webp"
          />
          <p class="text-gray-100 dark:text-gray-100 font-semibold text-center mt-4">
            {{ category.name }}
          </p>
        </NuxtLink>
      </div>
    </div>

    <!-- Items Section -->
    <div class="items-section mt-12">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center">Latest Items</h2>
      <div class="items-container">
        <div v-for="item in items" :key="item.title" class="item-card rounded-lg overflow-hidden shadow-md">
          <img :src="`api/items/${item.id}/serveImg`" :alt="item.title" class="item-image" />
          <div class="item-details">
            <h3 class="text-gray-100 mb-1 text-sm font-semibold">{{ item.title }}</h3>
            <div class="flex justify-start space-x-1">
              <Icon name="i-entypo-price-tag" style="color: #22c55e" />
              <p class="text-gray-400">{{ item.price }}€</p>
            </div>
            <p class="text-gray-400">{{ item.seller?.location }}</p>
            <div class="flex justify-start space-x-1">
              <Icon name="i-lets-icons-date-range" style="color: #f97316" />
              <p class="text-gray-400">{{ formatDateToDDMMYYYY(item.createdAt!) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New Section: Schmalify Description -->
    <div class="description-section text-center mt-12 px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4">What is Schmalify?</h2>
      <p class="text-gray-400 dark:text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
        Schmalify is a second-hand marketplace designed for students in Schmalkalden, providing a dedicated platform to buy
        and sell items within the local student community. Schmalify aims to simplify the trading process and foster a more
        efficient way for students to connect and exchange goods.
      </p>
    </div>
  </div>
</template>

<style scoped>
/* General container styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Horizontal scrolling for categories and items */
.categories-container,
.items-container {
  display: flex; /* Flexbox for horizontal layout */
  overflow-x: auto; /* Enable horizontal scrolling */
  gap: 1rem; /* Add spacing between items */
  padding-bottom: 1rem; /* Ensure the scrollbar is visible */
}

/* Styling for scrollbar */
.categories-container::-webkit-scrollbar,
.items-container::-webkit-scrollbar {
  height: 6px; /* Horizontal scrollbar height */
}

.categories-container::-webkit-scrollbar-thumb,
.items-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3); /* Scrollbar color */
  border-radius: 10px; /* Rounded scrollbar */
}

/* Card styling for categories */
.category-card {
  flex: 0 0 150px; /* Each card takes up 150px in width */
  max-width: 150px; /* Limit the max width of each card */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-image {
  width: 100%;
  height: 150px; /* Adjust height */
  object-fit: cover;
  border-radius: 0.5rem; /* Consistent border radius */
}

/* Card styling for items */
.item-card {
  flex: 0 0 150px; /* Maintain original width */
  max-width: 150px; /* Prevent cards from growing beyond 150px */
  background-color: rgba(255, 255, 255, 0.05); /* Semi-transparent dark background */
  backdrop-filter: blur(10px); /* Blur effect for smoothness */
  border: 1px solid rgba(255, 255, 255, 0.1); /* Subtle border */
  border-radius: 0.5rem;
  transition: transform 0.2s ease-in-out;
}

.item-card:hover {
  transform: translateY(-5px); /* Add a slight lift on hover */
}

/* Item Image Styling */
.item-image {
  width: 100%; /* Full width of the card */
  height: 150px; /* Keep the original height */
  object-fit: cover;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

/* Details section with proper positioning */
.item-details {
  padding: 1rem; /* Padding for text */
}

.item-details p {
  font-size: 0.875rem;
  color: #a0aec0; /* Color for better contrast */
  margin-bottom: 0.25rem;
}

/* Responsive layout for items */
@media (max-width: 1023px) {
  .items-container {
    grid-template-columns: repeat(2, minmax(0, 1fr)); /* Two-column layout on mobile */
  }
}

@media (min-width: 1024px) {
  .items-container {
    grid-auto-flow: column;
    grid-template-rows: repeat(2, auto);
    grid-auto-columns: minmax(200px, 1fr);
    overflow-x: auto;
    overflow-y: hidden;
  }

  .items-container::-webkit-scrollbar {
    height: 6px;
  }

  .items-container::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 10px;
  }
}

/* Styling for the description section */
.description-section {
  margin-top: 50px;
  padding: 20px;
  text-align: center;
}

.description-section p {
  max-width: 700px;
  margin: 0 auto;
  color: #a0aec0;
}

/* Increase the width for desktop screens */
@media (min-width: 1024px) {
  .description-section p {
    max-width: 900px;
  }
}
</style>

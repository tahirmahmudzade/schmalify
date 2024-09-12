<script setup lang="ts">
const modal = useModal()

const categories = [
  {
    name: 'Electronics',
    image: '/img/electronics.avif',
    to: 'categories/electronics',
  },
  { name: 'Books', image: '/img/books.jpg', to: 'categories/books' },
  {
    name: 'Clothing & Accessories',
    image: '/img/clothing.avif',
    to: 'categories/clothing',
  },
  {
    name: 'Furniture',
    image: '/img/furniture.avif',
    to: 'categories/furniture',
  },
  {
    name: 'Home & Garden',
    image: '/img/home-garden.avif',
    to: 'categories/home-garden',
  },
  {
    name: 'Sports & Outdoors',
    image: '/img/sport-outdoors.jpg',
    to: 'categories/sports-outdoors',
  },
]
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="text-center mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100">
        Swap or Sell, Do It Well! - Student Deals in Schmalkalden!
      </h1>
      <p
        class="text-gray-400 dark:text-gray-400 mt-2 text-sm sm:text-base lg:text-lg"
      >
        Discover great deals and unique items for sale near you
      </p>

      <!-- Search Bar -->
      <div
        class="mt-6 relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg"
      >
        <input
          type="text"
          placeholder="What are you looking for?"
          class="w-full py-3 pl-4 pr-10 rounded-full bg-gray-100 text-gray-900 focus:outline-none"
        />
        <button class="absolute right-0 top-0 mt-2 mr-4 text-gray-600">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
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

    <!-- Category Section -->
    <div class="category-section">
      <div
        class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 overflow-y-auto"
      >
        <!-- Loop through categories array with v-for -->
        <NuxtLink
          v-for="category in categories"
          :to="category.to"
          :key="category.name"
          class="category-card flex flex-col items-center p-4 rounded-lg shadow-md"
        >
          <NuxtImg
            :src="category.image"
            :alt="category.name"
            class="category-image w-full object-cover"
            format="webp"
          />
          <p
            class="text-gray-100 dark:text-gray-100 font-semibold text-center mt-4"
          >
            {{ category.name }}
          </p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}

/* Define the category section without scrolling on larger screens */
.category-section {
  max-height: none; /* No height restriction on larger screens */
  overflow-y: unset; /* Disable scrolling for larger screens */
}

/* Apply max-height and scrolling for mobile screens */
@media (max-width: 768px) {
  .category-section {
    max-height: 500px; /* Limit height for mobile devices */
    overflow-y: auto; /* Enable scrolling on mobile screens */
  }
}

/* Define the category card style */
.category-card {
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
}

/* Scale the card on hover for interaction */
.category-card:hover {
  transform: scale(1.05);
}

/* Adjust the category image to match the aspect ratio with reduced height */
.category-image {
  width: 100%;
  height: 150px; /* Slightly reduced height */
  object-fit: cover;
  border-radius: 0.5rem;
}

/* Add margin below image and center text */
p {
  margin-top: 12px;
  font-size: 16px;
  color: #2d3748;
}
</style>

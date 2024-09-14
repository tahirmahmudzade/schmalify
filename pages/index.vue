<script setup lang="ts">
const categories = [
  {
    name: 'All',
    image: '/img/categories/all.jpg',
    to: 'categories/all',
  },
  {
    name: 'For Free',
    image: '/img/categories/free.jpg',
    to: 'categories/free',
  },
  {
    name: 'Electronics',
    image: '/img/categories/electronics.avif',
    to: 'categories/electronics',
  },
  { name: 'Books', image: '/img/categories/books.jpg', to: 'categories/books' },
  {
    name: 'Clothing',
    image: '/img/categories/clothing.avif',
    to: 'categories/clothing',
  },
  {
    name: 'Furniture',
    image: '/img/categories/furniture.avif',
    to: 'categories/furniture',
  },
  {
    name: 'Home & Garden',
    image: '/img/categories/home-garden.avif',
    to: 'categories/home-garden',
  },
  {
    name: 'Sports & Outdoors',
    image: '/img/categories/sport-outdoors.jpg',
    to: 'categories/sports-outdoors',
  },
  {
    name: 'Health & Beauty',
    image: '/img/categories/health.jpg',
    to: 'categories/health-beauty',
  },
  {
    name: 'Jewelry & Accessories',
    image: '/img/categories/accessories.jpg',
    to: 'categories/accessories',
  },
  {
    name: 'Leasure & Games',
    image: '/img/categories/games.jpg',
    to: 'categories/games',
  },
]

const items = [
  {
    name: 'Laptop',
    image: '/img/items/laptop.jpg',
    price: '€500',
    location: 'Schmalkalden',
    category: 'Electronics',
    date: '2022-01-01',
    description: 'Brand new laptop for sale',
  },
  {
    name: 'iPhone',
    image: '/img/items/iphone.jpg',
    price: '€300',
    location: 'Schmalkalden',
    category: 'Electronics',
    date: '2022-01-01',
    description: 'Used iPhone for sale',
  },
  {
    name: 'Book',
    image: '/img/items/book.jpg',
    price: '€20',
    location: 'Schmalkalden',
    category: 'Books',
    date: '2022-01-01',
    description: 'Second-hand book for sale',
  },
  {
    name: 'Shirt',
    image: '/img/items/shirt.jpg',
    price: '€10',
    location: 'Schmalkalden',
    category: 'Clothing',
    date: '2022-01-01',
    description: 'New shirt for sale',
  },
  {
    name: 'Table',
    image: '/img/items/table.jpg',
    price: '€50',
    location: 'Schmalkalden',
    category: 'Furniture',
    date: '2022-01-01',
    description: 'Used table for sale',
  },
  {
    name: 'Plant',
    image: '/img/items/plant.jpg',
    price: '€15',
    location: 'Schmalkalden',
    category: 'Home & Garden',
    date: '2022-01-01',
    description: 'Small plant for sale',
  },
  {
    name: 'Bike',
    image: '/img/items/bike.jpg',
    price: '€100',
    location: 'Schmalkalden',
    category: 'Sports & Outdoors',
    date: '2022-01-01',
    description: 'Used bike for sale',
  },
  {
    name: 'Perfume',
    image: '/img/items/perfume.jpg',
    price: '€30',
    location: 'Schmalkalden',
    category: 'Health & Beauty',
    date: '2022-01-01',
    description: 'New perfume for sale',
  },
  {
    name: 'Necklace',
    image: '/img/items/necklace.jpg',
    price: '€25',
    location: 'Schmalkalden',
    category: 'Jewelry & Accessories',
    date: '2022-01-01',
    description: 'Used necklace for sale',
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

    <!-- Categories Section -->
    <div class="category-section">
      <h2
        class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center"
      >
        Categories
      </h2>
      <div class="categories-container">
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

    <!-- Items Section -->
    <div class="items-section mt-12">
      <h2
        class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4 text-center"
      >
        Latest Items
      </h2>
      <div class="items-container">
        <div
          v-for="item in items"
          :key="item.name"
          class="item-card flex flex-col items-center p-4 rounded-lg shadow-md"
        >
          <NuxtImg
            :src="item.image"
            :alt="item.name"
            class="item-image w-full object-cover"
            format="webp"
          />
          <p
            class="text-gray-100 dark:text-gray-100 font-semibold text-center mt-4"
          >
            {{ item.name }}
          </p>
          <p class="text-gray-400 text-center">{{ item.price }}</p>
          <p class="text-gray-400 text-center">{{ item.location }}</p>
          <p class="text-gray-400 text-center">{{ item.description }}</p>
        </div>
      </div>
    </div>

    <!-- New Section: Schmalify Description -->
    <div class="description-section text-center mt-12 px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100 mb-4">
        What is Schmalify?
      </h2>
      <p
        class="text-gray-400 dark:text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto"
      >
        Schmalify is a second-hand marketplace designed for students in
        Schmalkalden, providing a dedicated platform to buy and sell items
        within the local student community. Schmalify aims to simplify the
        trading process and foster a more efficient way for students to connect
        and exchange goods.
      </p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
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

/* Card styling for categories and items */
.category-card,
.item-card {
  flex: 0 0 150px; /* Each card takes up 150px in width */
  max-width: 150px; /* Limit the max width of each card */
}

.category-image,
.item-image {
  width: 100%;
  height: 150px; /* Adjust height */
  object-fit: cover;
  border-radius: 0.5rem; /* Consistent border radius */
}

/* Description section styling */
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

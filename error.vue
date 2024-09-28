<script setup lang="ts">
import { NuxtLink } from '#components'
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError,
})
</script>

<template>
  <div class="error-container flex items-center justify-center h-screen bg-gray-900 text-gray-100">
    <div class="text-center">
      <!-- Error Title -->
      <h2 class="text-2xl font-semibold mb-2">Oops! Something went wrong</h2>

      <!-- Error Description -->
      <p class="text-gray-400 mb-6">
        {{ `The page you're looking for doesn't exist or has been moved. Let us help you find your way back!` }}
      </p>

      <!-- Link to Home Page -->
      <NuxtLink to="/" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition-colors">
        Go back to Home
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 2rem;
  background-color: #111827; /* Dark background */
  color: #f3f4f6; /* Light text color */
}

h1 {
  font-size: 6rem;
  font-weight: bold;
  color: #f87171; /* Red color for the error code */
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1rem;
  margin-bottom: 2rem;
  color: #9ca3af; /* Light gray for the description */
}

/* Responsive design */
@media (max-width: 640px) {
  h1 {
    font-size: 4rem;
  }
  h2 {
    font-size: 1.25rem;
  }
  p {
    font-size: 0.875rem;
  }
}
</style>

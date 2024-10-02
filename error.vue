<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({ error: Object as () => NuxtError })
</script>

<template>
  <div class="flex items-center justify-center h-screen px-8 bg-gray-900 text-gray-100">
    <div class="text-center">
      <h2 class="text-2xl font-semibold mb-2">Oops! Something went wrong</h2>

      <p class="text-gray-400 mb-6">
        {{
          error?.message ||
          `The page you're looking for doesn't exist or has been moved. Let us help you find your way back!`
        }}
      </p>

      <NuxtLink to="/" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md shadow-md transition-colors">
        Go back to Home
      </NuxtLink>
    </div>
  </div>
</template>

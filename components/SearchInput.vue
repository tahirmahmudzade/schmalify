<script setup lang="ts">
import type { InputSize, InputColor } from '#ui/types'
import type { Item } from '~/server/database/drizzle'

const {
  inputSize = 'sm',
  inputColor = 'blue',
  placeholder = 'Search for everything...',
  iconSize = '1.5em',
  textSize = 'sm',
} = defineProps<{
  placeholder?: string
  inputSize?: InputSize
  inputColor?: InputColor
  iconSize?: string | number
  textSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
}>()

// Reactive variables
const searchQuery = ref('')
const debouncedSearchQuery = refDebounced(searchQuery, 500) // Debouncing to avoid too many requests
const items = ref<Item[]>([]) // Empty array to store the fetched items
const dropdownVisible = ref(false)
const loading = ref(false) // Loading state to track API calls
const searchPerformed = ref(false) // State to track if a search has been performed

// Fetch items based on search query
const fetchItems = async () => {
  if (debouncedSearchQuery.value.trim().length < 3) {
    items.value = []
    searchPerformed.value = false // No search was performed
    return
  }

  loading.value = true // Start loading
  searchPerformed.value = true // A search is in progress

  const data = await $fetch('/api/items', { query: { searchQuery: debouncedSearchQuery.value.trim() } })

  items.value = data || [] // Store the fetched items
  loading.value = false // End loading
}

// Watch the debounced search query and fetch items when it changes
watch(debouncedSearchQuery, () => {
  fetchItems()
})

// Clear items if the search query is empty
watch(searchQuery, val => {
  if (!val.trim()) {
    items.value = []
    searchPerformed.value = false // Reset search performed status
  }
})

// Filter items based on the search query
const filteredItems = computed(() => items.value)

// Functions to handle dropdown visibility
const showDropdown = () => {
  if (searchQuery.value) {
    dropdownVisible.value = true
  }
}

const hideDropdown = () => {
  setTimeout(() => {
    dropdownVisible.value = false
  }, 200) // slight delay to allow item click
}

// Handle item selection
const selectItem = (item: Item) => {
  searchQuery.value = '' // Clear the search input
  hideDropdown() // Hide the dropdown
  navigateTo(`/items/${item.id}`) // Navigate to the selected item's page
}

// Input handler
const onInput = () => {
  if (searchQuery.value) {
    showDropdown()
  } else {
    hideDropdown()
  }
}
</script>

<template>
  <div class="relative">
    <!-- Search Input -->
    <UInput
      :placeholder="placeholder"
      variant="outline"
      :color="inputColor"
      :size="inputSize"
      :ui="{
        base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 bg-gray-200 dark:bg-gray-200 text-black dark:!text-black',
        rounded: 'rounded-2xl',
      }"
      v-model="searchQuery"
      @input="onInput"
      @blur="hideDropdown"
    >
      <template #trailing>
        <Icon name="i-material-symbols-search" style="color: black" :size="iconSize" />
      </template>
    </UInput>

    <!-- Dropdown suggestions -->
    <ul
      v-if="searchQuery && dropdownVisible && filteredItems.length"
      class="absolute w-full bg-gray-200 border rounded-lg shadow-lg z-10 mt-1"
    >
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="selectItem(item)"
        class="p-2 cursor-pointer rounded-lg hover:bg-gray-300"
      >
        <p :class="`text-${textSize} text-black font-medium`">{{ item.title }}</p>
      </li>
    </ul>

    <!-- No items found message (only shows after search is performed and loading ends) -->
    <p
      v-else-if="!loading && searchPerformed && searchQuery && dropdownVisible && !filteredItems.length"
      class="absolute w-full bg-gray-200 border rounded-lg shadow-lg z-10 mt-1 p-2 text-xs text-gray-500"
    >
      No items found
    </p>
  </div>
</template>

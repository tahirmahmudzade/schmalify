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

const route = useRoute()
const { data: items } = useItems()

const path = computed(() => route.path)

watch(path, () => {
  searchQuery.value = ''
  hideDropdown()
})

const searchQuery = ref('')
const dropdownVisible = ref(false)

// UI styles for input
const uiInput = reactive({
  base: 'relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 bg-gray-200 dark:bg-gray-200 text-black dark:!text-black',
  rounded: 'rounded-2xl',
})

// Filter items based on the search query
const filteredItems = computed(() =>
  items.value.filter(item => item.title.toLowerCase().includes(searchQuery.value.toLowerCase())),
)

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
  searchQuery.value = item.title
  hideDropdown()
  navigateTo(`/items/${item.id}`)
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
      :ui="uiInput"
      v-model="searchQuery"
      @input="onInput"
      @blur="hideDropdown"
    >
      <template #trailing>
        <Icon name="i-material-symbols-search" style="color: black" :size="iconSize" />
      </template>
    </UInput>

    <!-- Dropdown suggestions -->
    <ul v-if="searchQuery && filteredItems.length" class="absolute w-full bg-gray-200 border rounded-lg shadow-lg z-10 mt-1">
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="selectItem(item)"
        class="p-2 cursor-pointer rounded-lg hover:bg-gray-300"
      >
        <p :class="`text-${textSize} text-gray-900 font-medium`">{{ item.title }}</p>
      </li>
    </ul>
  </div>
</template>

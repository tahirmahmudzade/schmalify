<script setup lang="ts">
const { items, placeholder = 'Search...' } = defineProps<{ items: any[]; placeholder: string }>()

// State and router
const searchQuery = ref('')
const dropdownVisible = ref(false)
const router = useRouter()

// Filter items based on the search query
const filteredItems = computed(() =>
  items.filter(item => item.title.toLowerCase().includes(searchQuery.value.toLowerCase())),
)

// Functions to handle dropdown visibility
const showDropdown = () => {
  dropdownVisible.value = true
}

const hideDropdown = () => {
  setTimeout(() => {
    dropdownVisible.value = false
  }, 200)
}

// Handle item selection
const selectItem = (item: any) => {
  searchQuery.value = item.title
  hideDropdown()
  router.push(`/items/${item.id}`)
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
    <input
      v-model="searchQuery"
      @input="onInput"
      @blur="hideDropdown"
      @focus="showDropdown"
      type="text"
      :placeholder="placeholder"
      class="input-class"
    />
    <!-- Dropdown suggestions -->
    <ul v-if="dropdownVisible && filteredItems.length" class="absolute w-full bg-white border rounded-lg shadow-lg z-10">
      <li
        v-for="(item, index) in filteredItems"
        :key="index"
        @click="selectItem(item)"
        class="p-2 cursor-pointer hover:bg-gray-100"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.input-class {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}
</style>

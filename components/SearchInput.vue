<script lang="ts">
import type { InputSize, InputColor } from '#ui/types'
import type { Item } from '~/server/database/drizzle'
</script>

<script setup lang="ts">
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

const { t } = useI18n()

const searchQuery = ref('')
const debouncedSearchQuery = refDebounced(searchQuery, 300)

const items = ref<Item[]>([])
const dropdownVisible = ref(false)
const loading = ref(false)
const searchPerformed = ref(false)

const fetchItems = async () => {
  if (debouncedSearchQuery.value.trim().length < 3) {
    items.value = []
    searchPerformed.value = false
    return
  }

  loading.value = true
  searchPerformed.value = true

  const data = await $fetch('/api/items', { query: { searchQuery: debouncedSearchQuery.value.trim() } })

  items.value = data || []
  loading.value = false
}

watch(debouncedSearchQuery, () => {
  fetchItems()
})

watch(searchQuery, val => {
  if (!val.trim()) {
    items.value = []
    searchPerformed.value = false
  }
})

const filteredItems = computed(() => items.value)

const showDropdown = () => {
  if (searchQuery.value) {
    dropdownVisible.value = true
  }
}

const hideDropdown = () => {
  setTimeout(() => {
    dropdownVisible.value = false
  }, 200)
}

const selectItem = (item: Item) => {
  searchQuery.value = ''
  hideDropdown()
  navigateTo(`/items/${item.id}`)
}

const onInput = () => {
  searchQuery.value ? showDropdown() : hideDropdown()
}
</script>

<template>
  <div class="relative">
    <UInput
      :placeholder="t(placeholder)"
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
      <template #leading>
        <Icon name="i-material-symbols-search" style="color: black" :size="iconSize" />
      </template>
    </UInput>

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

    <p
      v-else-if="!loading && searchPerformed && searchQuery && dropdownVisible && !filteredItems.length"
      class="absolute w-full bg-gray-200 border rounded-lg shadow-lg z-10 mt-1 p-2 text-xs text-gray-500"
    >
      {{ t('No items found') }}
    </p>
  </div>
</template>

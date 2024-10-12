<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import type { Category } from '~/server/database/drizzle'

const {
  title = 'All Products',
  description = 'Find unique second-hand items just for you',
  hideCategory = false,
  categories,
} = defineProps<{
  categories?: Category[]
  title?: string
  description?: string
  hideCategory?: boolean
}>()

const itemStore = useItemStore()
const { itemFilters } = storeToRefs(itemStore)
const { setCategoryFilter, setConditionFilter, setSortOption, setPriceFilter } = itemStore

const open = ref(false)

const sortOptions = [
  { name: 'Lowest Price', value: 'lowest-price' },
  { name: 'Highest Price', value: 'highest-price' },
  { name: 'Newest', value: 'newest' },
]

const minPrice = ref(MIN_ITEM_PRICE)
const maxPrice = ref(MAX_ITEM_PRICE)

// Watch for changes to price range and update the store
watch([minPrice, maxPrice], ([newMin, newMax]) => {
  // Ensure minPrice does not exceed maxPrice
  if (newMin > newMax) {
    minPrice.value = newMax // Sync minPrice to maxPrice if min exceeds max
  } else if (newMin < MIN_ITEM_PRICE) {
    minPrice.value = MIN_ITEM_PRICE // Ensure minPrice doesn't go below the minimum allowed value
  }

  // Ensure maxPrice does not fall below minPrice
  if (newMax < newMin) {
    maxPrice.value = newMin // Sync maxPrice to minPrice if max falls below min
  } else if (newMax > MAX_ITEM_PRICE) {
    maxPrice.value = MAX_ITEM_PRICE // Ensure maxPrice doesn't go above the maximum allowed value
  }

  // Update the price filter in the store
  setPriceFilter({ min: minPrice.value, max: maxPrice.value })
})

const filters = computed(() => {
  const baseFilters = [
    {
      id: 'condition',
      name: 'Condition',
      options: [
        { value: 'new', label: 'New' },
        { value: 'like new', label: 'Like New' },
        { value: 'very good', label: 'Very Good' },
        { value: 'good', label: 'Good' },
        { value: 'fair', label: 'Fair' },
        { value: 'poor', label: 'Poor' },
      ],
    },
    {
      id: 'price',
      name: 'Price',
      options: [], // Empty as we'll handle this with a range input
    },
  ]

  if (!hideCategory) {
    baseFilters.unshift({
      id: 'category',
      name: 'Category',
      options: categories?.map(category => ({ value: category.id, label: category.name })) || [],
    })
  }

  return baseFilters
})

function validatePrice(inputValue: number, isMin: boolean) {
  const value = Math.max(MIN_ITEM_PRICE, Math.min(MAX_ITEM_PRICE, inputValue)) // Ensure value is between 0 and 5000

  if (isMin) {
    if (value > maxPrice.value) {
      maxPrice.value = value // Sync maxPrice if minPrice exceeds it
    }
    return value
  } else {
    if (value < minPrice.value) {
      minPrice.value = value // Sync minPrice if maxPrice falls below it
    }
    return value
  }
}

function handleSortChange(option: string) {
  setSortOption(option) // Update the sort option in the store
}

function handleCategoryChange(categoryId: string) {
  setCategoryFilter(categoryId) // Update Pinia store for category filter
}

function handleConditionChange(condition: Condition) {
  setConditionFilter(condition) // Update Pinia store for condition filter
}
</script>

<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-40 sm:hidden" @close="open = false">
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 z-40 flex">
          <TransitionChild
            as="template"
            enter="transition ease-in-out duration-300 transform"
            enter-from="translate-x-full opacity-0"
            enter-to="translate-x-0 opacity-100"
            leave="transition ease-in-out duration-300 transform"
            leave-from="translate-x-0 opacity-100"
            leave-to="translate-x-full opacity-0"
          >
            <DialogPanel
              class="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl mt-14"
            >
              <div class="flex items-center justify-between px-4">
                <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  class="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  @click="open = false"
                >
                  <span class="sr-only">Close menu</span>
                  <Icon name="i-material-symbols-close-small-outline" size="2rem" />
                </button>
              </div>

              <!-- Filters -->
              <form class="mt-4">
                <Disclosure
                  as="div"
                  v-for="section in filters"
                  :key="section.name"
                  class="border-t border-gray-200 px-4 py-6"
                >
                  <h3 class="-mx-2 -my-3 flow-root">
                    <DisclosureButton class="flex w-full items-center justify-between px-2 py-3 text-sm">
                      <span class="font-medium text-gray-900">{{ section.name }}</span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel class="pt-6">
                    <div class="space-y-6">
                      <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
                        <input
                          :id="`filter-mobile-${section.id}-${optionIdx}`"
                          :name="`${section.id}[]`"
                          :value="option.value"
                          :checked="
                            section.id === 'category'
                              ? itemFilters.category.includes(option.value)
                              : itemFilters.condition.includes(option.value as Condition)
                          "
                          type="checkbox"
                          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          @change="
                            section.id === 'category'
                              ? handleCategoryChange(option.value)
                              : handleConditionChange(option.value as Condition)
                          "
                        />
                        <label :for="`filter-mobile-${section.id}-${optionIdx}`" class="ml-3 text-sm text-gray-900">
                          {{ option.label }}
                        </label>
                      </div>
                      <div v-if="section.id === 'price'">
                        <h4 class="font-semibold text-gray-700">Price</h4>
                        <div class="flex space-x-2 items-center mt-2">
                          <input
                            v-model="minPrice"
                            @input="
                              minPrice =
                                ($event.target as HTMLInputElement).value === ''
                                  ? MIN_ITEM_PRICE
                                  : validatePrice(Number(($event.target as HTMLInputElement).value), true)
                            "
                            type="number"
                            class="border border-gray-700 rounded w-20 p-1 text-sm text-gray-700"
                            placeholder="Min"
                            :max="MAX_ITEM_PRICE"
                            :min="MIN_ITEM_PRICE"
                          />
                          <span class="text-gray-500">-</span>
                          <input
                            v-model="maxPrice"
                            @input="
                              maxPrice =
                                ($event.target as HTMLInputElement).value === ''
                                  ? MAX_ITEM_PRICE
                                  : validatePrice(Number(($event.target as HTMLInputElement).value), false)
                            "
                            type="number"
                            class="border border-gray-700 rounded w-20 p-1 text-sm text-gray-700"
                            placeholder="Max"
                            :max="MAX_ITEM_PRICE"
                            :min="MIN_ITEM_PRICE"
                          />
                        </div>

                        <!-- Range Slider -->
                        <URange
                          v-model="minPrice"
                          :max="MAX_ITEM_PRICE"
                          :min="MIN_ITEM_PRICE"
                          size="md"
                          color="blue"
                          class="mt-4"
                        />
                        <URange
                          v-model="maxPrice"
                          :max="MAX_ITEM_PRICE"
                          :min="MIN_ITEM_PRICE"
                          size="md"
                          color="blue"
                          class="mt-2"
                        />
                      </div>
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
      <div class="py-8">
        <h1 class="text-4xl font-bold tracking-tight text-white">{{ title }}</h1>
        <p class="mx-auto mt-4 max-w-3xl text-base text-gray-300">{{ description }}</p>
      </div>

      <section aria-labelledby="filter-heading" class="border-t border-gray-200 py-6">
        <h2 id="filter-heading" class="sr-only">Product filters</h2>

        <div class="flex items-center justify-between">
          <!-- Sort Menu -->
          <Menu as="div" class="relative inline-block text-left">
            <div>
              <MenuButton class="group inline-flex justify-center text-sm font-medium text-gray-200 hover:text-gray-300">
                Sort
                <Icon class="ml-1 h-5 w-5 flex-shrink-0" name="i-mdi-chevron-down" />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <MenuItem v-for="option in sortOptions" :key="option.value" v-slot="{ active }">
                    <button
                      @click="handleSortChange(option.value)"
                      :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm font-medium text-gray-900']"
                    >
                      {{ option.name }}
                    </button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>

          <!-- Filters Button (Mobile) -->
          <button
            type="button"
            class="inline-block text-sm font-medium text-gray-200 hover:text-gray-300 sm:hidden"
            @click="open = true"
          >
            Filters
          </button>

          <!-- Filters (Desktop) -->
          <PopoverGroup class="hidden sm:flex sm:items-baseline sm:space-x-8">
            <Popover
              as="div"
              v-for="(section, sectionIdx) in filters"
              :key="section.id"
              :id="`desktop-menu-${sectionIdx}`"
              class="relative inline-block text-left"
            >
              <div>
                <PopoverButton
                  class="group inline-flex justify-center text-sm font-medium text-gray-200 hover:text-gray-300"
                >
                  <span>{{ section.name }}</span>
                  <Icon class="ml-1 h-5 w-5 flex-shrink-0" name="i-mdi-chevron-down" />
                </PopoverButton>
              </div>

              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <PopoverPanel
                  class="absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <form class="space-y-4">
                    <div v-for="(option, optionIdx) in section.options" :key="option.value" class="flex items-center">
                      <input
                        :id="`filter-${section.id}-${optionIdx}`"
                        :name="`${section.id}[]`"
                        :value="option.value"
                        :checked="
                          section.id === 'category'
                            ? itemFilters.category.includes(option.value)
                            : itemFilters.condition.includes(option.value as Condition)
                        "
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        @change="
                          section.id === 'category'
                            ? handleCategoryChange(option.value)
                            : handleConditionChange(option.value as Condition)
                        "
                      />
                      <label
                        :for="`filter-${section.id}-${optionIdx}`"
                        class="ml-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-900"
                      >
                        {{ option.label }}
                      </label>
                    </div>
                    <div v-if="section.id === 'price'">
                      <h4 class="font-semibold text-gray-700">Price</h4>
                      <div class="flex space-x-2 items-center mt-2">
                        <input
                          v-model="minPrice"
                          @input="
                            minPrice =
                              ($event.target as HTMLInputElement).value === ''
                                ? MIN_ITEM_PRICE
                                : validatePrice(Number(($event.target as HTMLInputElement).value), true)
                          "
                          type="number"
                          class="border border-gray-700 rounded w-20 p-1 text-sm text-gray-700"
                          placeholder="Min"
                          :max="MAX_ITEM_PRICE"
                          :min="MIN_ITEM_PRICE"
                        />

                        <span class="text-gray-500">-</span>
                        <input
                          v-model="maxPrice"
                          @input="
                            maxPrice =
                              ($event.target as HTMLInputElement).value === ''
                                ? MAX_ITEM_PRICE
                                : validatePrice(Number(($event.target as HTMLInputElement).value), false)
                          "
                          type="number"
                          class="border border-gray-700 rounded w-20 p-1 text-sm text-gray-700"
                          placeholder="Max"
                          :max="MAX_ITEM_PRICE"
                          :min="MIN_ITEM_PRICE"
                        />
                      </div>

                      <!-- Range Sliders -->
                      <URange
                        v-model="minPrice"
                        :max="MAX_ITEM_PRICE"
                        :min="MIN_ITEM_PRICE"
                        size="md"
                        color="blue"
                        class="mt-4"
                      />
                      <URange
                        v-model="maxPrice"
                        :max="MAX_ITEM_PRICE"
                        :min="MIN_ITEM_PRICE"
                        size="md"
                        color="blue"
                        class="mt-2"
                      />
                    </div>
                  </form>
                </PopoverPanel>
              </transition>
            </Popover>
          </PopoverGroup>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Hide the spinner controls on number inputs */
input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield; /* Hide spinner for Firefox */
}
</style>

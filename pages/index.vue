<script setup lang="ts">
import type { Category, Item } from '~/server/database/drizzle'
import { joinURL } from 'ufo'

const { t } = useI18n()

const title = 'Schmalify: Student Deals in Schmalkalden!'
const description =
  'Second-hand marketplace designed for students in Schmalkalden, providing a dedicated platform to buy and sell items within the local student community.'

useSeoMeta({
  title,
  ogTitle: title,
  description: description,
  ogDescription: description,
  ogImage: joinURL('https://www.schmalify.com', '/main-logo.png'),
  twitterImage: joinURL('https://www.schmalify.com', '/main-logo.png'),
})

const nonce = useNonce()

const [{ data: categoryRes, error: categoryError }, { data: itemRes, error: itemsError }] = await Promise.all([
  useFetch('/api/category'),
  useLatestItems(),
])

const categories = ref<Category[]>([])
const items = ref<(Item & { seller: { location: string | null } | null })[]>([])

if (categoryRes.value && itemRes.value && !categoryError.value && !itemsError.value) {
  categories.value = categoryRes.value.categories
  items.value = itemRes.value
} else {
  throw createError({
    statusCode: 500,
    message: 'Something went wrong loading the page, please try again later or contact support.',
  })
}

const schmalifyDescription =
  'Schmalify is a second-hand marketplace designed for students in Schmalkalden, providing a dedicated platform to buy and sell items within the local student community. Schmalify aims to simplify the trading process and foster a more efficient way for students to connect and exchange goods.'
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="text-center mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-100">
        {{ t('Swap or Sell, Do It Well! - Student Deals in Schmalkalden!') }}
      </h1>
      <p class="text-gray-700 dark:text-gray-300 mt-2 text-sm sm:text-base lg:text-lg">
        {{ t('Discover great deals and unique items for sale near you') }}
      </p>

      <div class="mt-6 relative mx-auto w-full max-w-xs sm:max-w-md lg:max-w-lg">
        <SearchInput :is-on-header="false" :placeholder="t('What are you looking for?')" input-size="xl" />
      </div>
    </div>

    <div class="category-section">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        {{ t('Categories') }}
      </h2>
      <div class="flex overflow-x-auto space-x-4 pb-4">
        <NuxtLink
          v-for="category in categories"
          :to="`/categories/${category.name.toLowerCase().trim()}`"
          :key="t(category.name)"
          class="bg-gray-200 dark:bg-gray-800 flex-none w-36 flex flex-col items-center p-4 rounded-lg shadow-md"
        >
          <NuxtImg
            :src="`/img/categories/${category.img!}`"
            :alt="category.name"
            :nonce="nonce"
            class="w-full h-36 object-cover rounded-lg"
            loading="lazy"
            format="webp"
            placeholder="/img/categories/default-category.webp"
            @error="event => handleImageError(event as Event, 'category')"
          />
          <p class="text-gray-900 dark:text-gray-100 font-semibold text-center mt-4">
            {{ t(category.name) }}
          </p>
        </NuxtLink>
      </div>
    </div>

    <div class="items-section mt-12">
      <div class="relative text-center mb-4">
        <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">{{ t('Latest Items') }}</h2>
        <NuxtLink
          to="/items"
          class="absolute right-0 top-1/2 transform -translate-y-1/2 text-sm sm:text-base lg:text-lg font-medium text-blue-500 hover:text-blue-400 transition-colors"
        >
          {{ t('Explore All') }}
        </NuxtLink>
      </div>
      <div class="flex overflow-x-auto space-x-4 pb-4">
        <div
          v-for="item in items"
          :key="item.title"
          class="flex-none w-36 bg-gray-200 dark:bg-gray-800 backdrop-filter backdrop-blur-lg border border-white border-opacity-10 rounded-lg shadow-md cursor-pointer transform transition-transform duration-200 hover:-translate-y-1 flex flex-col relative"
          @click="navigateTo(`/items/${item.id}`)"
        >
          <div v-if="item.status === 'sold'" class="absolute top-2 right-2">
            <UBadge :label="t('Sold')" color="red" size="md" />
          </div>

          <NuxtImg
            :src="`/api/blob/${item.id}/serveImg?fileName=${item.images![0]}`"
            :alt="item.title"
            :nonce="nonce"
            provider="cloudflare"
            loading="lazy"
            class="w-full h-36 object-cover rounded-t-lg"
            @error="event => handleImageError(event as Event, 'item')"
          />
          <div class="p-4 flex flex-col flex-grow">
            <h3 class="text-gray-900 dark:text-gray-100 mb-1 text-sm font-semibold line-clamp-2">{{ item.title }}</h3>
            <div class="mt-auto space-y-1">
              <div class="flex items-center space-x-2 whitespace-nowrap">
                <Icon name="i-entypo-price-tag" style="color: #22c55e" size="0.8rem" class="mt-0.5" />
                <p class="text-gray-700 dark:text-gray-400 text-xs">{{ item.price }} €</p>
              </div>
              <div class="flex items-center space-x-2 whitespace-nowrap">
                <Icon name="i-heroicons-calendar-date-range-16-solid" style="color: #f97316" size="0.8rem" class="mt-0.5" />
                <p class="text-gray-700 dark:text-gray-400 text-xs">{{ formatDateToDDMMYYYY(item.createdAt!) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="description-section text-center mt-12 px-4 sm:px-6 lg:px-8">
      <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {{ t('What is Schmalify?') }}
      </h2>
      <p class="text-gray-700 dark:text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed max-w-3xl mx-auto">
        {{ t(schmalifyDescription) }}
      </p>
    </div>
  </div>
</template>

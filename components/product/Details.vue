<script setup lang="ts">
const { name, price, description, avatarUrl, sellerName, condition, location, postedOn, categoryName } = defineProps<{
  name: string
  price: string
  description: string
  avatarUrl: string
  sellerName: string
  condition: string
  location: string
  postedOn: string
  categoryName: string
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="items-center">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ name }}</h1>
    </div>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center">
        <Icon name="i-entypo-price-tag" class="text-green-500 mr-1" size="1.5rem" />
        <p class="text-xl tracking-tight text-green-500 font-semibold">{{ price }}</p>
      </div>

      <NuxtLink
        v-if="categoryName"
        :to="`/categories/${categoryName.toLowerCase().trim()}`"
        class="text-blue-600 hover:underline text-sm font-medium"
      >
        {{ t(categoryName) }}
      </NuxtLink>
    </div>

    <div class="mt-6">
      <h3 class="sr-only">{{ t('Description') }}</h3>
      <div
        class="space-y-6 text-base text-gray-700 break-words overflow-hidden"
        style="word-wrap: break-word; max-height: 200px; overflow-y: auto"
        v-html="description"
      />
    </div>

    <div class="mt-6 flex items-center">
      <UAvatar :src="avatarUrl" alt="Avatar" size="md" class="w-10 h-10 rounded-full" />
      <p class="ml-2 text-md text-gray-500 italic">{{ sellerName }}</p>
    </div>

    <div class="mt-6">
      <ul class="mt-2 text-base text-gray-700 space-y-1">
        <li class="flex items-center">
          <Icon name="mdi:hammer-wrench" class="text-blue-500 mr-2" />
          <strong class="text-[15px]">{{ t('Condition') }}:</strong>
          <span class="ml-2 text-[15px]">{{ condition }}</span>
        </li>
        <li class="flex items-center">
          <Icon name="mdi:map-marker" class="text-red-500 mr-2" />
          <strong class="text-[15px]">{{ t('Location') }}:</strong>
          <span class="ml-2 text-[15px]">{{ location }}</span>
        </li>
        <li class="flex items-center">
          <Icon name="mdi:calendar" class="text-yellow-500 mr-2" />
          <strong class="text-[15px]">{{ t('Posted on') }}:</strong>
          <span class="ml-2 text-[15px]">{{ postedOn }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

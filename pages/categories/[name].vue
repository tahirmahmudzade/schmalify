<script setup lang="ts">
const route = useRoute('categories-name')

const name = computed(() => route.params.name)

const { data: categoryData, error } = await useFetch(`/api/category/${name.value}`)
const { filterItems } = useItemStore()
const { t } = useI18n()

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    message: t('Category not found or another error occurred, please try again later or contact support.'),
  })
}

useSeoMeta({
  title: `${name.value.charAt(0).toUpperCase() + name.value.slice(1)} Products`,
  description: () => `Discover the best ${name.value} products`,
  ogTitle: () => `${name.value} Products`,
  ogDescription: () => `Discover the best ${name.value} products`,
  ogImage: () => `/img/categories/${categoryData.value?.category.img}`,
  ogUrl: () => `${canonicalUrl}/categories/${name.value}`,
  ogType: 'website',
})
const category = categoryData.value!.category
const items = category.items

const filteredItems = computed(() => {
  return filterItems(items)
})
</script>

<template>
  <div>
    <ProductFilter :title="category.name" description="" :hideCategory="true" />
    <ProductList :items="filteredItems" />
  </div>
</template>

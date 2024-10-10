<script setup lang="ts">
const route = useRoute('categories-name')
const { data: categoryData, error } = await useFetch(`/api/category/${route.params.name}`)
const { filterItems } = useItemStore()

if (error.value) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    message: 'Category not found or another error occurred, please try again later or contact support.',
  })
}

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

import { defineStore } from 'pinia'

export const useItemStore = defineStore('item-store', () => {
  const itemFilters = reactive({
    category: [] as string[], // Change to array of strings to handle multiple categories
    condition: [] as Condition[], // Change to array of conditions
  })

  function setCategoryFilter(categoryId: string) {
    // Toggle the category in the array (add/remove)
    const index = itemFilters.category.indexOf(categoryId)
    if (index > -1) {
      itemFilters.category.splice(index, 1) // Remove if already in the array
    } else {
      itemFilters.category.push(categoryId) // Add if not already selected
    }
  }

  function setConditionFilter(condition: Condition) {
    // Toggle the condition in the array (add/remove)
    const index = itemFilters.condition.indexOf(condition)
    if (index > -1) {
      itemFilters.condition.splice(index, 1) // Remove if already in the array
    } else {
      itemFilters.condition.push(condition) // Add if not already selected
    }
  }

  return { itemFilters, setCategoryFilter, setConditionFilter }
})

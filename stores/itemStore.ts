import { defineStore } from 'pinia'
import type { Item } from '~/server/database/drizzle'

export const useItemStore = defineStore('item-store', () => {
  const itemFilters = reactive({ category: [] as string[], condition: [] as Condition[], selectedSort: 'newest' })

  const filterItems = (items: Item[]) => {
    let filtered = [...items]

    // Apply category filter
    if (itemFilters.category.length) {
      filtered = filtered.filter(item => itemFilters.category.includes(item.category_id!))
    }

    // Apply condition filter
    if (itemFilters.condition.length) {
      filtered = filtered.filter(item => itemFilters.condition.includes(item.condition!))
    }

    // Apply sorting
    switch (itemFilters.selectedSort) {
      case 'lowest-price':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'highest-price':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
        break
      default:
        break
    }

    return filtered
  }

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

  function setSortOption(option: string) {
    itemFilters.selectedSort = option // Set the selected sort option
  }

  function resetFilters() {
    itemFilters.category = [] // Reset the category filter
    itemFilters.condition = [] // Reset the condition filter
    itemFilters.selectedSort = 'newest' // Reset the sort
  }

  return { itemFilters, filterItems, setCategoryFilter, setConditionFilter, setSortOption, resetFilters }
})

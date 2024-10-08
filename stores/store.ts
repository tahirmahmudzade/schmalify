export const useStore = defineStore('store', () => {
  const refetchItems = ref(false)
  const refetchMyItems = ref(false)
  const refetchCategories = ref(false)
  const refetchLatestItems = ref(false)

  return { refetchItems, refetchMyItems, refetchCategories, refetchLatestItems }
})

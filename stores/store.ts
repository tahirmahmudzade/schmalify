export const useStore = defineStore('store', () => {
  const refetchItems = ref(false)
  const refetchCategories = ref(false)
  const refetchLatestItems = ref(false)

  return {
    refetchItems,
    refetchCategories,
    refetchLatestItems,
  }
})

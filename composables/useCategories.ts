import type { Category } from '~/server/database/drizzle'

export function useCategories() {
  const store = useStore()

  const { refetchCategories } = storeToRefs(store)

  return useFetch<Category[]>(`/api/category`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchCategories.value) {
        refetchCategories.value = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

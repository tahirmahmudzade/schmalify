import type { Category } from '~/server/database/drizzle'

export function useCategories() {
  const store = useStore()

  const { refetchEntities } = storeToRefs(store)

  return useFetch<Category[]>(`/api/category`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchEntities.value.categories) {
        refetchEntities.value.categories = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

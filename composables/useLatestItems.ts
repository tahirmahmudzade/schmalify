import type { Item } from '~/server/database/drizzle'

export function useLatestItems() {
  const store = useStore()

  const { refetchLatestItems } = storeToRefs(store)

  return useFetch<(Item & { seller: { location: string | null } | null })[]>(`/api/items/latest`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchLatestItems.value) {
        refetchLatestItems.value = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

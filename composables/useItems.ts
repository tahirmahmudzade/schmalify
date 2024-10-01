import type { Item } from '~/server/database/drizzle'

export function useItems() {
  const store = useStore()

  const { refetchItems } = storeToRefs(store)

  return useFetch<(Item & { seller: { location: string | null } | null })[]>(`/api/items`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchItems.value) {
        refetchItems.value = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

import type { Item } from '~/server/database/drizzle'

export function useLatestItems() {
  const store = useStore()

  const { refetchEntities } = storeToRefs(store)

  return useFetch<(Item & { seller: { location: string | null } | null })[]>(`/api/items/latest`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchEntities.value.latestItems) {
        refetchEntities.value.latestItems = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

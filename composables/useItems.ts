import type { Item } from '~/server/database/drizzle'

export function useItems() {
  const store = useStore()

  const { refetchEntities } = storeToRefs(store)

  return useFetch<(Item & { seller: { location: string | null } | null })[]>(`/api/items`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchEntities.value.items) {
        refetchEntities.value.items = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

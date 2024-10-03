import type { Item } from '~/server/database/drizzle'

export function useMyItems() {
  const store = useStore()
  const { loggedIn, user } = useUserSession()

  if (!loggedIn.value || !user.value) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { refetchMyItems } = storeToRefs(store)

  return useFetch<(Item & { category: { name: string } | null })[]>(`/api/users/${user.value.id}/myItems`, {
    default: () => [],
    getCachedData(key, nuxtApp) {
      if (refetchMyItems.value) {
        refetchMyItems.value = false
        return
      }
      return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    },
  })
}

export function useInfiniteScroll(loadItems: () => Promise<void>, loadingMore: Ref<boolean>, hasMoreItems: Ref<boolean>) {
  const handleScroll = () => {
    // Ensure we only load items if we're not already loading and if there are more items
    if (loadingMore.value || !hasMoreItems.value) return

    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const windowHeight = window.innerHeight || document.documentElement.clientHeight
    const fullHeight = document.documentElement.scrollHeight

    if (scrollTop + windowHeight + 100 >= fullHeight) {
      loadItems() // Trigger loadItems when we reach near the bottom of the page
    }
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
}

export default defineNuxtRouteMiddleware(to => {
  const restrictedCategoryRoutes = ['/categories', '/categories/']
  if (restrictedCategoryRoutes.includes(to.path)) {
    return navigateTo('/categories/all')
  }

  const restrictedProfileRoutes = ['/profile', '/profile/']
  if (restrictedProfileRoutes.includes(to.path)) {
    const { loggedIn } = useUserSession()

    if (!loggedIn.value) {
      return navigateTo('/')
    }
  }
})

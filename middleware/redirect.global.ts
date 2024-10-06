export default defineNuxtRouteMiddleware(to => {
  const restrictedCategoryRoutes = ['/categories', '/categories/']
  if (restrictedCategoryRoutes.includes(to.path)) {
    return navigateTo('/')
  }

  const { loggedIn } = useUserSession()

  if (to.path.startsWith('/profile')) {
    if (!loggedIn.value) {
      return navigateTo('/')
    }
  }
})

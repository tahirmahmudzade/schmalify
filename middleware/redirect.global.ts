export default defineNuxtRouteMiddleware(to => {
  const restrictedCategoryRoutes = ['/categories', '/categories/']
  if (restrictedCategoryRoutes.includes(to.path)) {
    return navigateTo('/categories/all')
  }
})

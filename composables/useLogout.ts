export const useLogout = () => {
  const toast = useToast()
  $fetch('/api/auth/logout')
    .then(() => {
      reloadNuxtApp({ path: '/' })
    })
    .catch(err => {
      console.log('Error logging out', err)

      toast.add({ title: err.data.message || 'Something went wrong, please try again later' })
    })
}

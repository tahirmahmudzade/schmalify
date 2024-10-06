export const useLogout = () => {
  const toast = useToast()
  $fetch('/api/auth/logout')
    .then(() => {
      toast.add({ title: 'User logged out' })
      reloadNuxtApp({ path: '/' })
    })
    .catch(err => {
      console.log('Error logging out', err)

      toast.add({ title: err.data.message || 'Something went wrong, please try again later' })
    })
}

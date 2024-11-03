export const useLogout = () => {
  const toast = useToast()
  const { $i18n } = useNuxtApp()
  const t = $i18n.t
  $fetch('/api/auth/logout')
    .then(() => {
      reloadNuxtApp({ path: '/' })
    })
    .catch(err => {
      console.log('Error logging out', err)

      toast.add({ title: err.data.message || t('Something went wrong, please try again later or contact support.') })
    })
}

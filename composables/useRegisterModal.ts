import RegisterModal from '~/components/modals/RegisterModal.vue'

export function useRegisterModal() {
  const modal = useModal()
  const toast = useToast()
  const { $i18n } = useNuxtApp()
  const t = $i18n.t

  const { user } = useUserSession()

  modal.open(RegisterModal, {
    user: user.value,
    onClose: (toLogin: boolean = false) => {
      modal.close()

      if (toLogin) {
        setTimeout(() => {
          useLoginModal()
        }, 500)
      } else {
        toast.add({ id: 'login-success', title: t('Successfully Signed up'), timeout: 1500 })
        setTimeout(() => {
          reloadNuxtApp({ path: '/profile', force: true })
        }, 1600)
      }
    },
  })
}

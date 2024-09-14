import RegisterModal from '~/components/modals/RegisterModal.vue'

export function useRegisterModal() {
  const modal = useModal()
  const toast = useToast()

  modal.open(RegisterModal, {
    onClose: (toLogin: boolean = false) => {
      modal.close()

      toast.add({
        id: 'login-success',
        title: 'Successfully logged in',
      })
      if (toLogin) {
        setTimeout(() => {
          useLoginModal()
        }, 500)
      } else {
        reloadNuxtApp({ path: '/' })
      }
    },
  })
}

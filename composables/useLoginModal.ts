import LoginModal from '~/components/modals/LoginModal.vue'

export function useLoginModal() {
  const modal = useModal()
  const toast = useToast()

  modal.open(LoginModal, {
    onClose: (toRegister: boolean = false) => {
      modal.close()

      toast.add({
        id: 'login-success',
        title: 'Successfully logged in',
      })

      if (toRegister) {
        setTimeout(() => {
          useRegisterModal()
        }, 500)
      } else {
        reloadNuxtApp({ path: '/' })
      }
    },
  })
}

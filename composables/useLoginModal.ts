import LoginModal from '~/components/modals/LoginModal.vue'

export function useLoginModal() {
  const modal = useModal()
  const toast = useToast()

  modal.open(LoginModal, {
    transition: true,
    onClose: (toRegister: boolean = false) => {
      modal.close()

      if (toRegister) {
        setTimeout(() => {
          useRegisterModal()
        }, 500)
      } else {
        toast.add({
          id: 'login-success',
          title: 'Successfully logged in',
          timeout: 2000,
        })
        setTimeout(() => {
          reloadNuxtApp({ path: '/', force: true })
        }, 2100)
      }
    },
    onForgotPassword: () => {
      modal.close()

      setTimeout(() => {
        useForgotPasswordModal()
      }, 500)
    },
  })
}

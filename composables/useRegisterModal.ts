import RegisterModal from '~/components/modals/RegisterModal.vue'

export function useRegisterModal() {
  const modal = useModal()
  const toast = useToast()

  modal.open(RegisterModal, {
    onClose: (toLogin: boolean = false) => {
      modal.close()

      if (toLogin) {
        setTimeout(() => {
          useLoginModal()
        }, 500)
      } else {
        toast.add({
          id: 'login-success',
          title: 'Successfully Signed up',
          timeout: 2000,
        })
        setTimeout(() => {
          reloadNuxtApp({ path: '/', force: true })
        }, 2100)
      }
    },
  })
}

import type { User } from '#auth-utils'
import RegisterModal from '~/components/modals/RegisterModal.vue'

export function useRegisterModal(user: User | null = null) {
  const modal = useModal()
  const toast = useToast()

  modal.open(RegisterModal, {
    user,
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
          reloadNuxtApp({ path: '/profile', force: true })
        }, 2100)
      }
    },
  })
}

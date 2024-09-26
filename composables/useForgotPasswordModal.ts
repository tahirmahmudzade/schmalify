import ForgotPasswordModal from '~/components/modals/ForgotPasswordModal.vue'

export function useForgotPasswordModal() {
  const modal = useModal()

  modal.open(ForgotPasswordModal, {
    transition: true,
    appear: true,
    onClose: () => {
      modal.close()
    },
  })
}

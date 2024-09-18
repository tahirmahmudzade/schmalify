import SellNowNotificationModal from '~/components/modals/SellNowNotificationModal.vue'

export const useSellNowNotificationModal = () => {
  const modal = useModal()

  modal.open(SellNowNotificationModal, {
    onCancel: () => {
      modal.close()
    },
    onSignUp: () => {
      modal.close()
      setTimeout(() => {
        useRegisterModal()
      }, 500)
    },
    onGuest: () => {
      modal.close()
      setTimeout(() => {
        useCreateLettingModal(true)
      }, 500)
    },
  })
}

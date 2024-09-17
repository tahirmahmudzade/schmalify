import SellNowNotificationModal from '~/components/modals/SellNowNotificationModal.vue'

export const useSellNowNotificationModal = () => {
  const modal = useModal()

  modal.open(SellNowNotificationModal, {
    onCancel: () => {
      modal.close()
    },
    onLogin: () => {
      modal.close()
      setTimeout(() => {
        useLoginModal()
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

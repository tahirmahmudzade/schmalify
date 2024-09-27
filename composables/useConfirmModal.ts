import ConfirmModal from '~/components/modals/ConfirmModal.vue'

export const useConfirmModal = (title: string, description: string): Promise<boolean> => {
  return new Promise(resolve => {
    const modal = useModal()

    modal.open(ConfirmModal, {
      title,
      description,
      onClose: () => {
        modal.close()
        resolve(false) // Resolve as false if the user closes the modal (cancels)
      },
      onConfirm: () => {
        modal.close()
        resolve(true) // Resolve as true if the user confirms
      },
    })
  })
}

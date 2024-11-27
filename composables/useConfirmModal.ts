import ConfirmModal from '~/components/modals/ConfirmModal.vue'

export const useConfirmModal = (title: string, description: string): Promise<boolean> => {
  return new Promise(resolve => {
    const modal = useModal()

    modal.open(ConfirmModal, {
      title,
      description,
      onClose: () => {
        modal.close()
        resolve(false)
      },
      onConfirm: () => {
        modal.close()
        resolve(true)
      },
    })
  })
}

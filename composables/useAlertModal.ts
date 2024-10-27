import AlertModal from '~/components/modals/AlertModal.vue'
import type { ButtonColor } from '#ui/types'

export function useAlertModal(
  title: string,
  description: string,
  confirmLabel: string,
  confirmColor: ButtonColor,
  confirmAction: () => void,
) {
  const modal = useModal()

  modal.open(AlertModal, {
    title,
    description,
    confirmLabel,
    confirmColor,
    onConfirm: () => {
      modal.close()
      setTimeout(() => {
        confirmAction()
      }, 500)
    },
    onClose: () => modal.close(),
  })
}

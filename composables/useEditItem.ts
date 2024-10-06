import AlertModal from '~/components/modals/AlertModal.vue'
import EditItemModal from '~/components/modals/EditItemModal.vue'
import type { Item } from '~/server/database/drizzle'

export function useEditItem(item: Item & { category: { name: string } | null }, refreshItems: () => Promise<void>) {
  const modal = useModal()

  const { user } = useUserSession()

  if (user.value && user.value.isGuest) {
    modal.open(AlertModal, {
      title: 'Limited Access',
      description: 'Guests are not allowed to edit listings, please click on sign in as user to edit listings.',
      confirmLabel: 'Sign in as a user',
      confirmColor: 'green',
      confirmAction() {
        modal.close()
        setTimeout(() => {
          useRegisterModal()
        }, 500)
      },
      onClose: () => {
        modal.close()
      },
    })
  } else {
    modal.open(EditItemModal, {
      item,
      refreshItems,
      onClose: () => modal.close(),
    })
  }
}

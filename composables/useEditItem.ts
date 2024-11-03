import EditItemModal from '~/components/modals/EditItemModal.vue'
import type { Item } from '~/server/database/drizzle'

export function useEditItem(item: Item & { category?: { name: string } | null }, refreshItems: () => Promise<void>) {
  const modal = useModal()

  modal.open(EditItemModal, {
    item,
    refreshItems,
    onClose: () => modal.close(),
  })
}

import ConfirmModal from '~/components/modals/ConfirmModal.vue'

export function useDeleteItem(itemId: string, refresh: () => Promise<void>) {
  const modal = useModal()
  const toast = useToast()
  const store = useStore()
  const { t } = useI18n()

  const { refetchEntities } = storeToRefs(store)

  modal.open(ConfirmModal, {
    title: 'Delete Item',
    description: 'Are you sure you want to delete this item?',
    onClose: () => modal.close(),
    onConfirm: async () => {
      // @ts-ignore
      await $fetch(`/api/items/${itemId}`, { method: 'DELETE' })
      toast.add({ title: t('Item deleted successfully') })
      refetchEntities.value.items = true
      refetchEntities.value.myItems = true
      refetchEntities.value.latestItems = true
      refresh()
      modal.close()
    },
  })
}

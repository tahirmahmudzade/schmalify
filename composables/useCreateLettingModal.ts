import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = async (asGuest: boolean = false) => {
  const modal = useModal()
  // const categories = useCategoryData()
  const data = await $fetch('/api/category')

  modal.open(CreateLettingModal, {
    categories: data.categories,
    asGuest,
    onClose: () => {
      modal.close()
    },
  })
}

import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = async (asGuest: boolean = false) => {
  const modal = useModal()
  // const categories = useCategoryData()
  const { data } = await useFetch('/api/category')

  modal.open(CreateLettingModal, {
    categories: data.value?.categories!,
    asGuest,
    onClose: () => {
      modal.close()
    },
  })
}

import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = (asGuest: boolean = false) => {
  const modal = useModal()

  modal.open(CreateLettingModal, {
    asGuest,
  })
}

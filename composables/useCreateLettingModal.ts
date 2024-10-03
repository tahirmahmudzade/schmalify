import type { User } from '#auth-utils'
import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = async (user: User, asGuest: boolean = false) => {
  const modal = useModal()

  const data = await $fetch('/api/category')

  modal.open(CreateLettingModal, {
    user,
    categories: data.categories,
    asGuest,
    onClose: () => {
      modal.close()
    },
  })
}

import AlertModal from '~/components/modals/AlertModal.vue'
import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = async (asGuest: boolean = false) => {
  const modal = useModal()
  const { user } = useUserSession()

  const data = await $fetch('/api/category')

  if (!user.value) {
    modal.open(CreateLettingModal, {
      categories: data.categories,
      asGuest,
      onClose: () => modal.close(),
    })
    return
  }

  if (user.value.isGuest) {
    modal.open(AlertModal, {
      title: 'Limited Access',
      description: 'Guests can only create one listing. Please sign in as a user to create more listings.',
      confirmLabel: 'Sign in as a user',
      confirmColor: 'green',

      onClose: () => modal.close(),
      onConfirm: () => {
        modal.close()
        setTimeout(() => {
          useRegisterModal()
        }, 500)
      },
    })
    return
  }

  const { phone } = await $fetch(`/api/users/${user.value.id}/phone`)

  if (!phone) {
    modal.open(AlertModal, {
      title: 'Phone Number Required',
      description: 'Please add a phone number to your account before creating a listing.',
      confirmLabel: 'Add Phone Number',
      confirmColor: 'green',
      onClose: () => modal.close(),
      onConfirm: () => {
        modal.close()
        navigateTo('/profile')
      },
    })
    return
  }

  modal.open(CreateLettingModal, {
    categories: data.categories,
    asGuest,
    onClose: () => modal.close(),
  })
}

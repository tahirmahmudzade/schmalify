import AlertModal from '~/components/modals/AlertModal.vue'
import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = async (asGuest: boolean = false) => {
  const modal = useModal()
  const { user } = useUserSession()

  // Fetch categories once and use them later
  const data = await $fetch('/api/category')

  // If user is not logged in, allow them to create a letting directly
  if (!user.value) {
    modal.open(CreateLettingModal, {
      categories: data.categories,
      asGuest,
      onClose: () => modal.close(),
    })
    return
  }

  // If user is logged in and is a guest
  if (user.value.isGuest) {
    modal.open(AlertModal, {
      title: 'Limited Access',
      description: 'Guests can only create one listing. Please sign in as a user to create more listings.',
      confirmLabel: 'Sign in as a user',
      confirmColor: 'green',
      // confirmAction() {
      //   modal.close()
      //   setTimeout(() => {
      //     useRegisterModal()
      //   }, 500)
      // },
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

  // If user is logged in and is not a guest, check for a phone number
  const { phone } = await $fetch(`/api/users/${user.value.id}/phone`)

  if (!phone) {
    modal.open(AlertModal, {
      title: 'Phone Number Required',
      description: 'Please add a phone number to your account before creating a listing.',
      confirmLabel: 'Add Phone Number',
      confirmColor: 'green',
      // confirmAction() {
      //   modal.close()
      //   navigateTo('/profile')
      // },
      onClose: () => modal.close(),
      onConfirm: () => {
        modal.close()
        navigateTo('/profile')
      },
    })
    return
  }

  // If user has a phone number, allow them to create a letting
  modal.open(CreateLettingModal, {
    categories: data.categories,
    asGuest,
    onClose: () => modal.close(),
  })
}

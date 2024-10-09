import AlertModal from '~/components/modals/AlertModal.vue'
import CreateLettingModal from '~/components/modals/CreateLettingModal.vue'

export const useCreateLettingModal = async (asGuest: boolean = false) => {
  const modal = useModal()
  const { user } = useUserSession()

  if (user.value && user.value.isGuest) {
    modal.open(AlertModal, {
      title: 'Limited Access',
      description: 'Guests can only create one listing, please click on sign in as user to create more listings.',
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
    const { phone } = await $fetch(`/api/users/${user.value?.id}/phone`)

    if (!phone) {
      modal.open(AlertModal, {
        title: 'Phone Number Required',
        description: 'Please add a phone number to your account before creating a listing.',
        confirmLabel: 'Add Phone Number',
        confirmColor: 'green',
        confirmAction() {
          modal.close()
          navigateTo('/profile')
        },
        onClose: () => {
          modal.close()
        },
      })
    } else {
      const data = await $fetch('/api/category')

      modal.open(CreateLettingModal, {
        categories: data.categories,
        asGuest,
        onClose: () => {
          modal.close()
        },
      })
    }
  }
}

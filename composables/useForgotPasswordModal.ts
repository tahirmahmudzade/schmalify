import ForgotPasswordModal from '~/components/modals/ForgotPasswordModal.vue'

export function useForgotPasswordModal() {
  const modal = useModal()

  modal.open(ForgotPasswordModal, {
    transition: true,
    appear: true,
    onClose: () => {
      modal.close()
    },
    // onResetPassword: async (email: string) => {
    //   try {
    //     await resetPassword(email)
    //     toast.add({
    //       id: 'reset-password-success',
    //       title: 'Password reset email sent',
    //       description: `An email has been sent to ${email} with instructions to reset your password.`,
    //       timeout: 3000,
    //     })
    //     modal.close()
    //   } catch (error) {
    //     toast.add({ id: 'reset-password-error', title: 'Error resetting password', color: 'red', timeout: 3000 })
    //   }
    // },
  })
}

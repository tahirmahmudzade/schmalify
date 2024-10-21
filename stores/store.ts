import { defineStore } from 'pinia'

export const useStore = defineStore(
  'store',
  () => {
    const refetchEntities = reactive({ items: false, myItems: false, categories: false, latestItems: false })

    const loginValidation = reactive({ failedAttempts: 0, lockoutExpiration: null as number | null })

    const resetPasswordValidation = reactive({ failedAttempts: 0, lockoutExpiration: null as number | null })

    return { refetchEntities, loginValidation, resetPasswordValidation }
  },
  {
    persist: { pick: ['loginValidation', 'resetPasswordValidation'] },
  },
)

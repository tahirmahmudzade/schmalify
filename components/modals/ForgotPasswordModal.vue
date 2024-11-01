<script setup lang="ts">
import z from 'zod'

const emit = defineEmits<{ (e: 'close'): void }>()

const { t } = useI18n()
const toast = useToast()

// State to track the current step
const step = ref<'email' | 'reset'>('email')

const emailLoading = ref(false)
const resetLoading = ref(false)

// Validation schemas
const emailSchema = z.object({ email: z.string().email({ message: t('Invalid email') }) })

const resetSchema = z
  .object({
    token: z.string().trim(),
    password: z
      .string()
      .trim()
      .min(8, { message: t('Password must be at least 8 characters long') })
      .max(15, { message: t('Password must be at most 15 characters long') }),
    confirmPassword: z.string().trim(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: t('Passwords do not match'),
    path: ['confirmPassword'],
  })

type EmailSchema = z.infer<typeof emailSchema>
type ResetSchema = z.infer<typeof resetSchema>

// State for email form
const emailState = reactive<EmailSchema>({ email: '' })

// State for reset password form
const resetState = reactive<ResetSchema>({ token: '', password: '', confirmPassword: '' })

const isEmailFormInvalid = computed(() => {
  const result = emailSchema.safeParse(emailState)
  return !result.success
})

const isResetFormInvalid = computed(() => {
  const result = resetSchema.safeParse(resetState)
  return !result.success
})

// Reactive current time
const now = useNow({ interval: 1000 })

// Import store and get resetPasswordValidation
const store = useStore()
const { resetPasswordValidation } = storeToRefs(store)

// Computed properties for lockout
const isResetLockedOut = computed(() => {
  const lockoutExpiration = resetPasswordValidation.value.lockoutExpiration
  return lockoutExpiration !== null && now.value.getTime() < lockoutExpiration
})

const resetLockoutRemainingTime = computed(() => {
  const lockoutExpiration = resetPasswordValidation.value.lockoutExpiration
  if (lockoutExpiration !== null) {
    const remaining = lockoutExpiration - now.value.getTime()
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0
  }
  return 0
})

function onClose() {
  emit('close')
}

async function onSubmitEmail() {
  emailLoading.value = true
  try {
    const res = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: { email: emailState.email.trim() },
    })

    if (res.statusCode === 404) {
      toast.add({ color: 'red', title: t(res.message) })
    } else {
      toast.add({ color: 'green', title: t('Reset link sent to your email') })
      step.value = 'reset'
    }
  } catch (err: any) {
    toast.add({
      color: 'red',
      title: t(err.data?.message || 'Something went wrong, please try again later or contact support.'),
    })
  } finally {
    emailLoading.value = false
  }
}

async function onSubmitReset() {
  if (isResetLockedOut.value) {
    return
  }

  resetLoading.value = true
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: resetState.token.trim(),
        password: resetState.password.trim(),
        confirmPassword: resetState.confirmPassword.trim(),
        email: emailState.email.trim(),
      },
    })

    resetPasswordValidation.value.failedAttempts = 0
    resetPasswordValidation.value.lockoutExpiration = null

    toast.add({ color: 'green', title: t('Password reset successfully') })
    onClose()
  } catch (err: any) {
    const message = t(err.data?.message || 'Error resetting password')
    toast.add({ color: 'red', title: message })

    resetPasswordValidation.value.failedAttempts += 1

    if (resetPasswordValidation.value.failedAttempts >= 5) {
      resetPasswordValidation.value.lockoutExpiration = now.value.getTime() + 60 * 1000
      resetPasswordValidation.value.failedAttempts = 0
    }
  } finally {
    resetLoading.value = false
  }
}
</script>

<template>
  <UModal :transition="true">
    <template #default>
      <div class="modal-container">
        <div class="modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
          <div class="p-6">
            <form class="flex flex-col w-full text-center">
              <h3 class="mb-3 text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {{ step === 'email' ? t('Forgot Password') : t('Reset Password') }}
              </h3>
              <p class="mb-4 text-gray-700 dark:text-gray-300">
                {{
                  step === 'email'
                    ? t('Enter your email address to reset your password.')
                    : t('Enter the code you received and your new password below.')
                }}
              </p>

              <div v-if="step === 'email'">
                <UForm :schema="emailSchema" :state="emailState">
                  <UFormGroup :label="t('Email')" name="email">
                    <UInput v-model="emailState.email" :placeholder="t('your-email@example.com')" />
                  </UFormGroup>
                </UForm>
                <UButton
                  color="white"
                  class="mt-5 py-2 w-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                  :label="t('Send reset link')"
                  :ui="{ rounded: 'rounded-lg' }"
                  :disabled="isEmailFormInvalid"
                  :loading="emailLoading"
                  @click="onSubmitEmail"
                />
              </div>

              <div v-else-if="step === 'reset'">
                <UForm :schema="resetSchema" :state="resetState">
                  <UFormGroup :label="t('Code')" name="token">
                    <UInput v-model="resetState.token" :placeholder="t('Enter your code')" />
                  </UFormGroup>
                  <UFormGroup :label="t('New Password')" name="password">
                    <UInput v-model="resetState.password" type="password" />
                  </UFormGroup>
                  <UFormGroup class="mt-3" :label="t('Confirm Password')" name="confirmPassword">
                    <UInput v-model="resetState.confirmPassword" type="password" />
                  </UFormGroup>
                </UForm>
                <UButton
                  color="white"
                  class="mt-5 py-2 w-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                  :label="isResetLockedOut ? `${t('Wait')} ${resetLockoutRemainingTime}s` : t('Reset Password')"
                  :ui="{ rounded: 'rounded-lg' }"
                  :disabled="isResetFormInvalid || isResetLockedOut"
                  :loading="resetLoading"
                  @click="onSubmitReset"
                />
                <p v-if="isResetLockedOut" class="text-red-500 mt-2">
                  {{ t('Too many failed attempts. Please wait') }} {{ resetLockoutRemainingTime }}
                  {{ t('seconds before trying again.') }}
                </p>
              </div>

              <UButton
                color="white"
                class="mt-3 py-2 w-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-white"
                :label="t('Cancel')"
                :ui="{ rounded: 'rounded-lg' }"
                @click="onClose"
              />
            </form>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped>
.modal-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1rem;
  pointer-events: none;
}

.modal-content {
  pointer-events: auto;
}

@media (max-height: 500px) {
  .modal-container {
    align-items: flex-start;
    padding-top: 2rem;
    padding-bottom: 2rem;
    overflow-y: auto;
  }
}
</style>

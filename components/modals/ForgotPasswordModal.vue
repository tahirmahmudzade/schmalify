<script setup lang="ts">
import z from 'zod'
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'close'): void }>()

const toast = useToast()

// State to track the current step
const step = ref<'email' | 'reset'>('email')

// Validation schemas
const emailSchema = z.object({ email: z.string().email({ message: 'Invalid email' }) })

const resetSchema = z
  .object({
    token: z.string().nonempty({ message: 'Token is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(15, { message: 'Password must be at most 15 characters long' }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
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

function onClose() {
  emit('close')
}

async function onSubmitEmail() {
  try {
    const res = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: emailState,
    })

    if (res.statusCode === 404) {
      toast.add({ color: 'red', title: res.message })
    } else {
      toast.add({ color: 'green', title: 'Reset link sent to your email' })
      step.value = 'reset'
    }
  } catch (err: any) {
    toast.add({
      color: 'red',
      title: err.data.message || 'Something  went wrong, please try again later or contact support.',
    })
  }
}

async function onSubmitReset() {
  try {
    await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: resetState,
    })
    toast.add({ color: 'green', title: 'Password reset successfully' })
    onClose()
  } catch (err: any) {
    console.log('Error resetting password', err)

    toast.add({ color: 'red', title: err.data.message || 'Error resetting password' })
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
                {{ step === 'email' ? 'Forgot Password' : 'Reset Password' }}
              </h3>
              <p class="mb-4 text-gray-700 dark:text-gray-300">
                {{
                  step === 'email'
                    ? 'Enter your email address to reset your password.'
                    : 'Enter the token you received and your new password below.'
                }}
              </p>

              <!-- Email Form -->
              <div v-if="step === 'email'">
                <UForm :schema="emailSchema" :state="emailState">
                  <UFormGroup label="Email" name="email">
                    <UInput v-model="emailState.email" placeholder="your-email@example.com" />
                  </UFormGroup>
                </UForm>
                <UButton
                  color="white"
                  class="mt-5 py-2 w-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                  label="Send reset link"
                  :ui="{ rounded: 'rounded-lg' }"
                  :disabled="isEmailFormInvalid"
                  @click="onSubmitEmail"
                />
              </div>

              <!-- Reset Password Form -->
              <div v-else-if="step === 'reset'">
                <UForm :schema="resetSchema" :state="resetState">
                  <UFormGroup label="Token" name="token">
                    <UInput v-model="resetState.token" placeholder="Enter your token" />
                  </UFormGroup>
                  <UFormGroup label="New Password" name="password">
                    <UInput v-model="resetState.password" type="password" />
                  </UFormGroup>
                  <UFormGroup class="mt-3" label="Confirm Password" name="confirmPassword">
                    <UInput v-model="resetState.confirmPassword" type="password" />
                  </UFormGroup>
                </UForm>
                <UButton
                  color="white"
                  class="mt-5 py-2 w-full flex items-center justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                  label="Reset Password"
                  :ui="{ rounded: 'rounded-lg' }"
                  :disabled="isResetFormInvalid"
                  @click="onSubmitReset"
                />
              </div>

              <UButton
                color="white"
                class="mt-3 py-2 w-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 hover:text-white"
                label="Cancel"
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
/* Reuse the modal styles from your SignInModal */
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

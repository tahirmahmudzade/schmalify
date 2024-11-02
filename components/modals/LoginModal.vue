<script setup lang="ts">
import z from 'zod'

const emit = defineEmits<{ (e: 'close', toRegister?: boolean): void; (e: 'forgotPassword'): void }>()

const { t } = useI18n()
const toast = useToast()

const store = useStore()

const now = useNow({ interval: 1000 })

const { loginValidation } = storeToRefs(store)

const schema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: t('Invalid email') })
    .max(40, { message: t('Email must be at most 40 characters long') }),
  password: z
    .string({ message: t('Invalid password') })
    .trim()
    .min(8, { message: t('Password must be at least 8 characters long') })
    .max(15, { message: t('Password must be at most 15 characters long') }),
})

type Schema = z.output<typeof schema>

const credentials = reactive<Schema>({ email: '', password: '' })
const loading = ref(false)

const isFormInvalid = computed(() => {
  const result = schema.safeParse(credentials)
  return !result.success
})

const isLockedOut = computed(() => {
  const lockoutExpiration = loginValidation.value.lockoutExpiration
  return lockoutExpiration !== null && now.value.getTime() < lockoutExpiration
})

const lockoutRemainingTime = computed(() => {
  const lockoutExpiration = loginValidation.value.lockoutExpiration
  if (lockoutExpiration !== null) {
    const remaining = lockoutExpiration - now.value.getTime()
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0
  }
  return 0
})

function onClose() {
  emit('close', false)
}

async function onSubmit() {
  if (isLockedOut.value) {
    return
  }
  loading.value = true
  try {
    await $fetch<{ statusCode: number; message: string }>('/api/auth/login', {
      method: 'POST',
      body: { email: credentials.email.trim(), password: credentials.password.trim() },
    })

    loginValidation.value.failedAttempts = 0
    loginValidation.value.lockoutExpiration = null

    onClose()
  } catch (err: any) {
    loading.value = false
    credentials.password = ''
    const message =
      err.data.statusCode === 429
        ? t('You have exceeded the maximum number of login attempts, please try again in one minute.')
        : err.data.message

    toast.add({ color: 'red', title: message || t('Invalid email or password') })
    loginValidation.value.failedAttempts += 1

    if (loginValidation.value.failedAttempts >= 5) {
      // Set lockout expiration time to current time + 1 minute
      loginValidation.value.lockoutExpiration = Date.now() + 60 * 1000 // 1 minute
      loginValidation.value.failedAttempts = 0
    }
  }
}

async function onRegister() {
  emit('close', true)
}

function onForgotPassword() {
  emit('forgotPassword')
}
</script>

<template>
  <UModal :transition="true">
    <template #default>
      <!-- Modal Overlay (provided by UModal) -->
      <div class="modal-container">
        <!-- Modal Content -->
        <div class="modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
          <div class="p-6">
            <form class="flex flex-col w-full text-center">
              <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">{{ t('Log in') }}</h3>
              <p class="mb-4 text-gray-700 dark:text-gray-300">{{ t('Enter your email and password') }}</p>
              <UButton
                icon="i-flat-color-icons-google"
                color="white"
                class="py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                :label="t('Log in With Google')"
                :ui="{
                  base: 'max-w-lg',
                  rounded: 'rounded-lg',
                }"
                @click="reloadNuxtApp({ path: '/api/auth/google' })"
              />
              <div class="flex items-center my-3">
                <hr class="h-0 border-b border-gray-500 dark:border-gray-600 grow" />
                <p class="mx-4 text-gray-600 dark:text-gray-400">{{ t('or') }}</p>
                <hr class="h-0 border-b border-gray-500 dark:border-gray-600 grow" />
              </div>

              <UForm :schema="schema" :state="credentials">
                <UFormGroup :label="t('Email')" name="email">
                  <UInput v-model="credentials.email" placeholder="your-email@example.com" />
                </UFormGroup>

                <UFormGroup class="mt-3" :label="t('Password')" name="password">
                  <UInput v-model="credentials.password" type="password" />
                </UFormGroup>

                <!-- Forgot Password Link -->
                <div class="text-right mt-2">
                  <a @click="onForgotPassword" class="text-sm text-blue-500 hover:underline cursor-pointer">
                    {{ t('Forgot Password?') }}
                  </a>
                </div>
              </UForm>
              <!-- Existing Login Button -->
              <UButton
                color="white"
                :icon="isFormInvalid || isLockedOut ? 'i-flat-color-icons-lock' : ''"
                class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                :label="isLockedOut ? `${t('Wait')} ${lockoutRemainingTime}s` : t('Log in')"
                :ui="{
                  rounded: 'rounded-lg',
                  color: { white: { solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600' } },
                }"
                :loading="loading"
                :disabled="isFormInvalid || isLockedOut"
                @click="onSubmit"
              />

              <!-- Lockout Message -->
              <p v-if="isLockedOut" class="text-red-500 mt-2">
                {{ t('Too many failed attempts. Please wait') }} {{ lockoutRemainingTime }}
                {{ t('seconds before trying again.') }}
              </p>
              <p class="text-sm leading-relaxed mt-3 text-gray-700 dark:text-gray-300">
                {{ t('Not registered yet?') }}
                <span @click="onRegister" class="font-bold cursor-pointer text-blue-500 dark:text-blue-400">
                  {{ t('Create an Account') }}
                </span>
              </p>
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
  /* Use fixed positioning to cover the entire viewport */
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 1rem; /* Adjust padding as needed */
  pointer-events: none; /* Allow clicks to pass through */
}

.modal-content {
  pointer-events: auto; /* Enable clicks on modal content */
}

@media (max-height: 500px) {
  /* Adjust for small screen heights */
  .modal-container {
    align-items: flex-start;
    padding-top: 2rem;
    padding-bottom: 2rem;
    overflow-y: auto;
  }
}
</style>

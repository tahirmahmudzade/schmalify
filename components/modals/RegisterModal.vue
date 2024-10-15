<script setup lang="ts">
import type { User } from '#auth-utils'
import z from 'zod'

const { user = null } = defineProps<{ user?: User | null }>()

const emit = defineEmits<{ (e: 'close', toLogin?: boolean): void }>()

const toast = useToast()

const schema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: 'Invalid email' })
    .max(40, { message: 'Email must be at most 40 characters long' }),
  password: z
    .string({ message: 'Invalid password' })
    .trim()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' }),
  username: z
    .string()
    .trim()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
})

type Schema = z.output<typeof schema>

const credentials = reactive<Schema>({ email: '', password: '', username: '' })
const loading = ref(false)

const isFormInvalid = computed(() => {
  const result = schema.safeParse(credentials)
  return !result.success
})

async function onSubmit() {
  loading.value = true
  try {
    if (user?.isGuest && user.id) {
      await $fetch<{ statusCode: number; message: string }>(`/api/users/${user.id}/upgrade`, {
        method: 'PATCH',
        body: { email: credentials.email, password: credentials.password, username: credentials.username },
      })
    } else {
      await $fetch<{ statusCode: number; message: string }>('/api/auth/register', {
        method: 'POST',
        body: { email: credentials.email, password: credentials.password, username: credentials.username },
      })
    }
    onClose()
  } catch (err: any) {
    loading.value = false
    console.error(err)
    toast.add({
      color: 'red',
      title: err.data.message || 'Something went wrong, please try again later or contact support',
    })
  }
}

function onClose() {
  emit('close')
}

function onLogin() {
  emit('close', true)
}
</script>

<template>
  <UModal>
    <template #default>
      <!-- Modal Overlay (provided by UModal) -->
      <div class="modal-container">
        <!-- Modal Content -->
        <div class="modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
          <div class="p-6">
            <form class="flex flex-col w-full text-center">
              <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">Sign Up</h3>
              <p class="mb-4 text-gray-700 dark:text-gray-300">Create your account</p>
              <UButton
                icon="i-flat-color-icons-google"
                color="white"
                class="py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                label="Sign Up With Google"
                :ui="{ base: 'max-w-lg', rounded: 'rounded-lg' }"
              />
              <div class="flex items-center my-3">
                <hr class="h-0 border-b border-gray-500 dark:border-gray-600 grow" />
                <p class="mx-4 text-gray-600 dark:text-gray-400">or</p>
                <hr class="h-0 border-b border-gray-500 dark:border-gray-600 grow" />
              </div>

              <UForm :schema="schema" :state="credentials">
                <UFormGroup label="Email" name="email">
                  <UInput v-model="credentials.email" required placeholder="your-email@example.com" />
                </UFormGroup>

                <UFormGroup class="mt-3" label="Password" name="password">
                  <UInput v-model="credentials.password" required type="password" />
                </UFormGroup>

                <UFormGroup class="mt-3" label="Username" name="username">
                  <UInput v-model="credentials.username" required placeholder="yourusername" />
                </UFormGroup>
              </UForm>
              <UButton
                color="white"
                :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
                class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                label="Sign Up"
                :ui="{
                  rounded: 'rounded-lg',
                  color: { white: { solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600' } },
                }"
                :loading="loading"
                :disabled="isFormInvalid"
                @click="onSubmit"
              />
              <p class="text-sm leading-relaxed mt-3 text-gray-700 dark:text-gray-300">
                Already have an account?
                <span @click="onLogin" class="font-bold cursor-pointer text-blue-500 dark:text-blue-400"> Log In </span>
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

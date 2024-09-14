<script setup lang="ts">
import z from 'zod'

const emit = defineEmits<{
  (e: 'close', toLogin?: boolean): void
}>()

const schema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .max(40, { message: 'Email must be at most 40 characters long' }),
  password: z
    .string({ message: 'Invalid password' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(15, { message: 'Password must be at most 15 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
})

type Schema = z.output<typeof schema>

const credentials = reactive<Schema>({
  email: '',
  password: '',
  username: '',
})

const isFormInvalid = computed(() => {
  const result = schema.safeParse(credentials)
  return !result.success
})

function onClose() {
  emit('close')
}

async function onSubmit() {
  try {
    await $fetch<{ statusCode: number; message: string }>(
      '/api/auth/register',
      {
        method: 'POST',
        body: credentials,
      }
    )

    onClose()
  } catch (err) {
    console.error(err)
  }
}

async function onLogin() {
  emit('close', true)
}
</script>

<template>
  <UModal>
    <div class="rounded-lg py-10 md:py-10 lg:py-5">
      <div class="container flex flex-col mx-auto rounded-lg">
        <div
          class="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable"
        >
          <div class="flex items-center justify-center w-full lg:p-12">
            <div class="flex items-center xl:p-10">
              <form
                class="flex flex-col w-full h-full pb-6 text-center rounded-3xl"
              >
                <h3 class="mb-3 text-4xl font-extrabold text-dark-grey-900">
                  Sign Up
                </h3>
                <p class="mb-4 text-grey-700">Enter your email and password</p>
                <UButton
                  icon="i-flat-color-icons-google"
                  color="white"
                  class="py-2 justify-center bg-white dark:bg-white text-gray-900 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white dark:hover:text-white"
                  label="Sign In With Google"
                  :ui="{
                    base: 'max-w-lg', // Max width and centering
                    rounded: 'rounded-lg', // Rounded corners
                  }"
                />
                <div class="flex items-center mb-3">
                  <hr class="h-0 border-b border-solid border-grey-500 grow" />
                  <p class="mx-4 text-grey-600">or</p>
                  <hr class="h-0 border-b border-solid border-grey-500 grow" />
                </div>

                <UForm :schema="schema" :state="credentials">
                  <UFormGroup label="Email" name="email">
                    <UInput
                      v-model="credentials.email"
                      placeholder="anyataylor1@gmail.com"
                    />
                  </UFormGroup>

                  <UFormGroup class="mt-3" label="Password" name="password">
                    <UInput v-model="credentials.password" type="password" />
                  </UFormGroup>

                  <UFormGroup class="mt-3" label="Username" name="username">
                    <UInput
                      v-model="credentials.username"
                      placeholder="anyataylor1"
                    />
                  </UFormGroup>
                </UForm>
                <UButton
                  color="white"
                  :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
                  class="mt-5 py-2 justify-center bg-white dark:bg-white text-gray-900 dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-800 hover:text-white dark:hover:text-white"
                  label="Sign In"
                  :ui="{
                    // base: 'mx-auto',
                    rounded: 'rounded-lg', // Rounded corners
                    color: {
                      white: {
                        solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-400',
                      },
                    },
                  }"
                  :disabled="isFormInvalid"
                  @click="onSubmit"
                />
                <p class="text-sm leading-relaxed mt-3">
                  Already have an account?
                  <span @click="onLogin" class="font-bold cursor-pointer"
                    >Log in</span
                  >
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>

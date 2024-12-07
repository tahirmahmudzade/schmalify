<script setup lang="ts">
import { z } from 'zod'
import type { Item, User } from '~/server/database/drizzle'

const { t } = useI18n()
const toast = useToast()
const { user } = useUserSession()
const { data: userData } = await useFetch<User & { items: (Item & { category: { name: string } | null })[] }>(
  `/api/users/${user.value?.id}`,
  { pick: ['email', 'firstName', 'lastName', 'location', 'phone', 'avatar', 'username'] },
)

if (!userData.value) {
  throw createError({ statusCode: 404, message: t('Failed to load user data') })
}

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9+]/g, '')
}

const schema = z.object({
  email: z
    .string()
    .email({ message: t('Invalid email') })
    .max(40, { message: t('Email must be at most 40 characters long') }),
  firstName: z
    .string()
    .max(40, { message: t('First name must be at most 40 characters long') })
    .optional(),
  lastName: z
    .string()
    .max(50, { message: t('Last name must be at most 50 characters long') })
    .optional(),
  location: z
    .string()
    .max(50, { message: t('Location must be at most 50 characters long') })
    .optional(),
  phone: z
    .string()
    .optional()
    .refine(
      (value: string | undefined): boolean => {
        return initialData.phone ? validatePhoneNumber(value!) && value !== '' : !value || validatePhoneNumber(value)
      },
      { message: t('Invalid phone number') },
    ),
  avatar: z.string().optional(),
})

const guestSchema = z.object({
  firstName: z
    .string()
    .max(40, { message: t('First name must be at most 40 characters long') })
    .optional(),
  lastName: z
    .string()
    .max(50, { message: t('Last name must be at most 50 characters long') })
    .optional(),
  phone: z
    .string({ message: t('Phone number is required') })
    .refine((value: string): boolean => validatePhoneNumber(value), { message: t('Invalid phone number') }),
})

type Schema = z.infer<typeof schema>
const state = reactive<Schema>({
  email: userData.value?.email || '',
  firstName: userData.value?.firstName || '',
  lastName: userData.value?.lastName || '',
  location: userData.value?.location || '',
  phone: userData.value?.phone || '',
  avatar: userData.value?.avatar || '',
})

const initialData = reactive<Schema>({ ...state })

const loading = ref(false)
const showTooltip = ref(true)

const isFormInvalid = computed(() => {
  const validation = user.value?.isGuest ? guestSchema.safeParse(state) : schema.safeParse(state)
  return !validation.success || loading.value
})

const isFormUnchanged = computed(() => {
  return (
    state.email === initialData.email &&
    state.firstName === initialData.firstName &&
    state.lastName === initialData.lastName &&
    state.location === initialData.location &&
    state.phone === initialData.phone &&
    state.avatar === initialData.avatar
  )
})

async function handleLogout() {
  if (user.value?.isGuest) {
    const confirmTitle = 'Logout as Guest'
    const confirmDescription = `You are logging out as a guest, you won't be able to log back in. Are you sure you want to continue?`
    const confirmed = await useConfirmModal(confirmTitle, confirmDescription)
    if (!confirmed) {
      return
    }
  }
  try {
    await $fetch('/api/auth/logout')
    toast.add({ title: t('User logged out') })
    reloadNuxtApp({ path: '/' })
  } catch (err: any) {
    console.log('Error logging out', err)
    toast.add({ title: t(err.data.message) || t('Something went wrong, please try again later or contact support') })
  }
}

async function uploadImage(e: Event) {
  const input = e.target as HTMLInputElement
  const formData = new FormData()

  if (input.files && input.files[0]) {
    formData.append('avatar', input.files[0])
  }

  try {
    await $fetch(`/api/users/${user.value?.id}/uploadImg`, { method: 'POST', body: formData })
    reloadNuxtApp()
  } catch (err: any) {
    console.log('Error uploading image', err.data)
    toast.add({
      title: err.data.message || t('Error uploading image, please try again later or contact support'),
      color: 'red',
    })
  }
}

async function onSubmit() {
  loading.value = true
  try {
    // @ts-ignore - for some reason method PATCH is not recognized
    await $fetch(`/api/users/${user.value?.id}`, { method: 'PATCH', body: state })
    toast.add({ title: t('Profile updated successfully') })

    Object.assign(initialData, state)
  } catch (error: any) {
    toast.add({ title: error.data.message || t('Error updating profile') })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    showTooltip.value = false
  }, 2000)
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-4">
    <div class="flex flex-col items-center justify-center">
      <div class="mt-8 flex flex-col lg:flex-row items-start lg:space-x-8 w-full max-w-6xl space-y-8 lg:space-y-0">
        <div class="w-full lg:w-1/4 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div class="w-32 h-32 relative">
            <Tooltip text="Click to change your profile picture." :duration="2000" />

            <label for="avatarInput" :class="user?.isGuest ? '' : 'cursor-pointer'">
              <img
                :src="getProfilePicUrl(userData?.avatar, user?.id)"
                alt="User Avatar"
                class="w-full h-full object-cover rounded-full"
                @error="event => handleImageError(event, 'user')"
              />
            </label>

            <input
              v-if="!user?.isGuest"
              id="avatarInput"
              type="file"
              class="hidden"
              @change="uploadImage"
              accept="image/*"
            />
          </div>

          <h2 class="mt-4 text-xl font-bold">{{ userData?.username }}</h2>
          <p class="text-gray-700 dark:text-gray-400">{{ state.firstName }} {{ state.lastName }}</p>
          <p class="text-gray-700 dark:text-gray-400">{{ state.email }}</p>
          <p class="text-gray-700 dark:text-gray-400">{{ state.location }}</p>
          <p class="text-gray-700 dark:text-gray-400">{{ state.phone || t('Phone number not provided') }}</p>
        </div>

        <div class="w-full lg:w-3/4">
          <div class="bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">{{ t('Account Details') }}</h3>

            <UForm :schema="schema" :state="state">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div v-if="!user?.isGuest" class="bg-gray-400 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">{{ t('Email') }}</h4>
                    <UInput v-model="state.email" placeholder="johncena@gmail.com" type="email" id="email" />
                  </UFormGroup>
                </div>

                <div class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">{{ t('First Name') }}</h4>
                    <UInput v-model="state.firstName" placeholder="John" type="text" id="first-name" />
                  </UFormGroup>
                </div>

                <div class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup
                    ><h4 class="block mb-2">{{ t('Last Name') }}</h4>
                    <UInput v-model="state.lastName" placeholder="Cena" type="text" id="last-name" />
                  </UFormGroup>
                </div>

                <div v-if="!user?.isGuest" class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">{{ t('Address') }}</h4>
                    <UInput v-model="state.location" placeholder="Blechammer 9B Haus 2, 999" type="text" id="location" />
                  </UFormGroup>
                </div>

                <div class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">{{ t('Phone Number') }}</h4>
                    <UInput
                      v-model="state.phone"
                      type="text"
                      :placeholder="t('Number with country code (e.g. +495556667788)')"
                      id="phone"
                      class="w-full"
                      @input="onPhoneInput"
                    />
                  </UFormGroup>
                </div>
              </div>

              <div class="mt-6 text-right">
                <UButton
                  @click="onSubmit"
                  :color="isFormInvalid || isFormUnchanged ? 'red' : 'primary'"
                  :disabled="isFormInvalid || isFormUnchanged"
                  :label="t('Save')"
                  variant="outline"
                />
              </div>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

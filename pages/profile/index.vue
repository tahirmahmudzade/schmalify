<script setup lang="ts">
import { z } from 'zod'

const toast = useToast()
const { user } = useUserSession()
const { data: userData } = await useFetch(`/api/users/${user.value?.id}`)

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9+]/g, '') // Only allow + and numbers
}

const schema = z.object({
  email: z.string().email({ message: 'Invalid email' }).max(40, { message: 'Email must be at most 40 characters long' }),
  firstName: z.string().max(40, { message: 'First name must be at most 40 characters long' }).optional(),
  lastName: z.string().max(50, { message: 'Last name must be at most 50 characters long' }).optional(),
  location: z.string().optional(),
  phone: z
    .string()
    .regex(phoneRegex, { message: 'Phone number must contain only numbers and a leading + symbol' })
    .refine(value => validatePhoneNumber(value), { message: 'Invalid phone number' }),
  avatar: z.string().optional(),
})

type Schema = z.infer<typeof schema>
// Initialize the state with user data
const state = reactive<Schema>({
  email: userData.value?.email || '',
  firstName: userData.value?.firstName || '',
  lastName: userData.value?.lastName || '',
  location: userData.value?.location || '',
  phone: userData.value?.phone || '',
  avatar: userData.value?.avatar || '',
})

// Store initial data for comparison
const initialData = reactive<Schema>({ ...state })

const loading = ref(false)
const showTooltip = ref(true)

// Check if any required fields are missing or invalid
const isFormInvalid = computed(() => {
  const validation = schema.safeParse(state)
  return !validation.success || loading.value || state.phone === ''
})

// Check if the form data has changed
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
      return // If the user cancels, stop the logout process
    }
  }
  try {
    await $fetch('/api/auth/logout')
    toast.add({ title: 'User logged out' })
    reloadNuxtApp({ path: '/' })
  } catch (err: any) {
    console.log('Error logging out', err)
    toast.add({ title: err.data.message || 'Something went wrong, please try again later' })
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
      title: err.data.message || 'Error uploading image, please try again later or contact support',
      color: 'red',
    })
  }
}

async function onSubmit() {
  loading.value = true
  try {
    await $fetch(`/api/users/${user.value?.id}`, { method: 'PATCH', body: state })
    toast.add({ title: 'Profile updated successfully' })
    // Update initial data to match the new state
    Object.assign(initialData, state)
  } catch (error: any) {
    toast.add({ title: error.data.message || 'Error updating profile' })
  } finally {
    loading.value = false // Re-enable the button after submission
  }
}

onMounted(() => {
  setTimeout(() => {
    showTooltip.value = false
  }, 2000) // Tooltip disappears after 2 seconds
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white p-4">
    <!-- Main Container for centering the whole profile section -->
    <div class="flex flex-col items-center justify-center">
      <!-- Container for the profile and account details -->
      <div class="mt-8 flex flex-col lg:flex-row items-start lg:space-x-8 w-full max-w-6xl space-y-8 lg:space-y-0">
        <!-- Avatar and User Info -->
        <div class="w-full lg:w-1/4 text-center lg:text-left flex flex-col items-center lg:items-start">
          <!-- Avatar Image Container with Tooltip -->
          <div class="w-32 h-32 relative">
            <!-- Tooltip -->
            <div
              v-if="showTooltip && !user?.isGuest"
              class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white text-xs rounded px-2 py-1"
              style="white-space: nowrap"
            >
              Click to change your profile picture.
              <!-- Tooltip Arrow -->
              <div
                class="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-700"
              ></div>
            </div>

            <!-- Avatar Image as Button -->
            <label for="avatarInput" :class="user?.isGuest ? '' : 'cursor-pointer'">
              <img
                :src="getProfilePicUrl(userData?.avatar, user?.id)"
                alt="User Avatar"
                class="w-full h-full object-cover rounded-full"
                @error="event => handleImageError(event, 'user')"
              />
            </label>

            <!-- Hidden File Input -->
            <input
              v-if="!user?.isGuest"
              id="avatarInput"
              type="file"
              class="hidden"
              @change="uploadImage"
              accept="image/*"
            />
          </div>

          <!-- Username and details, stacked on small screens -->
          <h2 class="mt-4 text-xl font-bold">{{ userData?.username }}</h2>
          <p class="text-gray-700 dark:text-gray-400">{{ state.firstName }} {{ state.lastName }}</p>
          <p class="text-gray-700 dark:text-gray-400">{{ state.email }}</p>
          <p class="text-gray-700 dark:text-gray-400">{{ state.location }}</p>
          <p class="text-gray-700 dark:text-gray-400">{{ state.phone || 'Phone number not provided' }}</p>
        </div>

        <!-- User Details -->
        <div class="w-full lg:w-3/4">
          <!-- User Info Cards -->
          <div class="bg-gray-300 dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Account Details</h3>

            <UForm :schema="schema" :state="state">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Email -->
                <div v-if="!user?.isGuest" class="bg-gray-400 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">Email</h4>
                    <UInput v-model="state.email" type="email" id="email" />
                  </UFormGroup>
                </div>

                <!-- First Name -->
                <div class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">First Name</h4>
                    <UInput v-model="state.firstName" :disabled="user?.isGuest" type="text" id="first-name" />
                  </UFormGroup>
                </div>

                <!-- Last Name -->
                <div class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup
                    ><h4 class="block mb-2">Last Name</h4>
                    <UInput v-model="state.lastName" :disabled="user?.isGuest" type="text" id="last-name" />
                  </UFormGroup>
                </div>

                <!-- Location -->
                <div v-if="!user?.isGuest" class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">Address</h4>
                    <UInput v-model="state.location" type="text" id="location" />
                  </UFormGroup>
                </div>

                <!-- Phone -->
                <div class="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg">
                  <UFormGroup>
                    <h4 class="block mb-2">Phone</h4>
                    <UInput
                      v-model="state.phone"
                      :disabled="user?.isGuest"
                      type="text"
                      id="phone"
                      class="w-full"
                      @input="onPhoneInput"
                    />
                  </UFormGroup>
                </div>
              </div>

              <!-- Save Button -->
              <div class="mt-6 text-right">
                <UButton @click="onSubmit" :disabled="isFormInvalid || isFormUnchanged" label="Save" />
              </div>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

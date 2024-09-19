<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const toast = useToast()
const { user } = useUserSession()

// Fetch user data
const { data: userData } = await useFetch(`/api/users/${user.value?.id}`)

// Define the validation schema using Zod
const schema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .max(40, { message: 'Email must be at most 40 characters long' }),
  firstName: z
    .string()
    .max(40, { message: 'First name must be at most 40 characters long' })
    .optional(),
  lastName: z
    .string()
    .max(50, {
      message: 'Last name must be at most 50 characters long',
    })
    .optional(),
  location: z.string().optional(),
  phone: z
    .string()
    .max(15, { message: 'Phone number must be at most 15 digits' })
    .optional(),
  avatar: z.string().optional(),
})

type Schema = z.infer<typeof schema>

// Initialize the state with user data
const state = reactive<Schema>({
  email: userData?.value?.email || '',
  firstName: userData?.value?.firstName || '',
  lastName: userData?.value?.lastName || '',
  location: userData?.value?.location || '',
  phone: userData?.value?.phone || '',
  avatar: userData?.value?.avatar || '',
})

// Store initial data for comparison
const initialData = reactive<Schema>({ ...state })

const loading = ref(false)

// Check if any required fields are missing or invalid
const isFormInvalid = computed(() => {
  const validation = schema.safeParse(state)
  return !validation.success || loading.value
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

function logout() {
  $fetch('/api/auth/logout').then(() => {
    toast.add({
      title: 'User logged out',
    })
    reloadNuxtApp({ path: '/' })
  })
}

async function onSubmit() {
  loading.value = true //
  // Handle form submission
  console.log('Form submitted:', state)
  // Perform saveChanges logic here (e.g., send data to your API)
  try {
    await $fetch(`/api/users/${user.value?.id}`, {
      method: 'PATCH',
      body: state,
    })
    toast.add({
      title: 'Profile updated successfully',
    })
    // Update initial data to match the new state
    Object.assign(initialData, state)
  } catch (error: any) {
    toast.add({
      title: 'Error updating profile',
    })
  } finally {
    loading.value = false // Re-enable the button after submission
  }
}
</script>

<template>
  <div class="bg-gray-900 min-h-screen text-white p-4">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-semibold">Profile</h1>
      <button
        @click="logout"
        class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
    </div>

    <!-- User Profile Section -->
    <div
      class="mt-8 flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8"
    >
      <!-- Avatar and User Info -->
      <div class="w-full lg:w-1/4 text-center lg:text-left">
        <!-- Avatar Image -->
        <div class="relative w-32 h-32 mx-auto lg:mx-0">
          <img
            :src="state.avatar || 'https://via.placeholder.com/150'"
            alt="User Avatar"
            class="w-full h-full object-cover rounded-full"
          />
        </div>

        <!-- Username -->
        <h2 class="mt-4 text-xl font-bold">{{ userData?.username }}</h2>
        <p class="text-gray-400">{{ state.firstName }} {{ state.lastName }}</p>
        <p class="text-gray-400">{{ state.email }}</p>
        <p class="text-gray-400">
          {{ state.location || 'Location not provided' }}
        </p>
        <p class="text-gray-400">
          {{ state.phone || 'Phone number not provided' }}
        </p>
      </div>

      <!-- User Details -->
      <div class="w-full lg:w-3/4">
        <!-- User Info Cards -->
        <div class="bg-gray-800 p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Account Details</h3>

          <!-- Begin UForm -->
          <UForm :schema="schema" :state="state">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Email -->
              <div class="bg-gray-700 p-4 rounded-lg">
                <UFormGroup label="Email" name="email">
                  <UInput v-model="state.email" type="email" />
                </UFormGroup>
              </div>

              <!-- First Name -->
              <div class="bg-gray-700 p-4 rounded-lg">
                <UFormGroup label="First Name" name="firstName">
                  <UInput v-model="state.firstName" type="text" />
                </UFormGroup>
              </div>

              <!-- Last Name -->
              <div class="bg-gray-700 p-4 rounded-lg">
                <UFormGroup label="Last Name" name="lastName">
                  <UInput v-model="state.lastName" type="text" />
                </UFormGroup>
              </div>

              <!-- Location -->
              <div class="bg-gray-700 p-4 rounded-lg">
                <UFormGroup label="Location" name="location">
                  <UInput v-model="state.location" type="text" />
                </UFormGroup>
              </div>

              <!-- Phone -->
              <div class="bg-gray-700 p-4 rounded-lg">
                <UFormGroup label="Phone" name="phone">
                  <UInput v-model="state.phone" type="text" />
                </UFormGroup>
              </div>
            </div>

            <!-- Save Button -->
            <div class="mt-6 text-right">
              <UButton
                @click="onSubmit"
                :disabled="isFormInvalid || isFormUnchanged"
                label="Save"
              />
            </div>
          </UForm>
          <!-- End UForm -->
        </div>
      </div>
    </div>
  </div>
</template>

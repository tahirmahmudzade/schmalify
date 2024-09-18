<script setup lang="ts">
import z from 'zod'
import type { Category } from '~/server/database/drizzle'

const { categories, asGuest } = defineProps<{
  categories: readonly Category[]
  asGuest: boolean
}>()

const emit = defineEmits<{
  (e: 'close', success?: boolean): void
}>()

const toast = useToast()
const { user } = useUserSession()

const userId = ref(user.value?.id)

const schema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(20, { message: 'Title must be at most 20 characters long' }),
  description: z
    .string()
    .max(100, { message: 'Description must be at most 100 characters long' })
    .optional(),
  price: z
    .number()
    .min(1, { message: 'Price must be greater than 0' })
    .max(5000, {
      message: 'Price must be at most 5000',
    }),
  condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], {
    message: 'Condition is required',
  }),
  ...(asGuest && {
    firstName: z.string().min(1, { message: 'First name is required' }),
    lastName: z.string().optional(),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 digits' })
      .max(15, { message: 'Phone number must be at most 15 digits' })
      .regex(phoneRegex, {
        message: 'Phone number must start with + and include the country code',
      }),
  }),
})

const itemData = reactive({
  title: '',
  description: '',
  price: '',
  condition: 'new',
  firstName: '',
  lastName: '',
  phone: '',
  category: '',
})

const isFormInvalid = computed(() => {
  const result = schema.safeParse(itemData)
  return !result.success
})

const categoryNames = computed(() => categories.map((c) => c.name))

function onClose() {
  emit('close', false)
}

async function onSubmit() {
  const categoryId = categories.find((c) => c.name === itemData.category)?.id

  try {
    if (asGuest) {
      const newGuest = await $fetch('/api/auth/guestLogin', {
        method: 'POST',
        body: {
          firstName: itemData.firstName,
          lastName: itemData.lastName || '',
          phone: itemData.phone,
        },
      })

      userId.value = newGuest.guest.id
    }

    const body = {
      title: itemData.title,
      description: itemData.description,
      price: itemData.price,
      condition: itemData.condition,
      categoryId,
      userId: userId.value,
    }

    await $fetch<{ statusCode: number; message: string }>('/api/items', {
      method: 'POST',
      body,
    })

    toast.add({
      color: 'green',
      title: 'Item created successfully',
    })
  } catch (err) {
    toast.add({
      color: 'red',
      title: 'Failed to create letting, please try again later with valid data',
    })
  } finally {
    onClose()
  }
}
</script>

<template>
  <UModal :transition="true">
    <template #default>
      <!-- Modal Overlay (provided by UModal) -->
      <div class="modal-container">
        <!-- Modal Content -->
        <div
          class="modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md"
        >
          <div class="p-6">
            <form class="flex flex-col w-full text-center">
              <h3
                class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100"
              >
                Create Item
              </h3>
              <p class="mb-4 text-gray-700 dark:text-gray-300">
                Fill in the details to list an item
              </p>

              <UForm :schema="schema" :state="itemData">
                <!-- Display guest fields when asGuest is true -->
                <div v-if="asGuest">
                  <div class="flex space-x-4">
                    <UFormGroup name="firstName" class="w-1/2">
                      <template #label>
                        <div class="flex items-center justify-start space-x-1">
                          <span>First Name</span>
                          <span class="text-red-500">*</span>
                        </div>
                      </template>
                      <UInput
                        v-model="itemData.firstName"
                        placeholder="First name"
                      />
                    </UFormGroup>

                    <UFormGroup label="Last Name" name="lastName" class="w-1/2">
                      <UInput
                        v-model="itemData.lastName"
                        placeholder="Last name"
                      />
                    </UFormGroup>
                  </div>

                  <UFormGroup class="mt-3" name="phone">
                    <template #label>
                      <div class="flex items-center justify-start space-x-1">
                        <span>Phone Number</span>
                        <span class="text-red-500">*</span>
                      </div>
                    </template>
                    <UInput
                      v-model="itemData.phone"
                      type="tel"
                      placeholder="Number with country code (e.g. +495556667788)"
                    />
                  </UFormGroup>
                </div>

                <UFormGroup class="mt-3" name="title">
                  <template #label>
                    <div class="flex items-center justify-start space-x-1">
                      <span>Title</span>
                      <span class="text-red-500">*</span>
                    </div>
                  </template>
                  <UInput
                    v-model="itemData.title"
                    placeholder="Shot title (max 20 characters)"
                  />
                </UFormGroup>

                <UFormGroup class="mt-3" label="Description" name="description">
                  <UInput
                    v-model="itemData.description"
                    placeholder="Item description (max length: 100 characters)"
                  />
                </UFormGroup>
                <UFormGroup class="mt-3" label="Category" name="category">
                  <USelectMenu
                    v-model="itemData.category"
                    :options="categoryNames"
                  />
                </UFormGroup>

                <UFormGroup class="mt-3" name="price">
                  <template #label>
                    <div class="flex items-center justify-start space-x-1">
                      <span>Price</span>
                      <span class="text-red-500">*</span>
                    </div>
                  </template>
                  <UInput
                    v-model="itemData.price"
                    type="number"
                    placeholder="Price in euro (max 5000)"
                  />
                </UFormGroup>

                <UFormGroup class="mt-3" label="Condition" name="condition">
                  <USelect
                    v-model="itemData.condition"
                    :options="[
                      'new',
                      'like new',
                      'very good',
                      'good',
                      'fair',
                      'poor',
                    ]"
                  />
                </UFormGroup>
              </UForm>

              <UButton
                color="white"
                :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
                class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                label="Create Item"
                :ui="{
                  rounded: 'rounded-lg',
                  color: {
                    white: {
                      solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600',
                    },
                  },
                }"
                :disabled="isFormInvalid"
                @click="onSubmit"
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

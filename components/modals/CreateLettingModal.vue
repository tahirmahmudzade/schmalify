<script setup lang="ts">
import z from 'zod'
import type { Category } from '~/server/database/drizzle'

const { categories, asGuest } = defineProps<{ categories: readonly Category[]; asGuest: boolean }>()

const emit = defineEmits<{ (e: 'close', success?: boolean): void }>()

const toast = useToast()

const buttonLoading = ref(false)
const imageFiles = ref<File[]>([]) // Store an array of images
const imagePreviews = ref<string[]>([])

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9+]/g, '') // Only allow + and numbers
}

const schema = computed(() =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required' })
      .max(35, { message: 'Title must be at most 35 characters long' }),
    description: z.string().max(400, { message: 'Description must be at most 400 characters long' }).optional(),
    ...(itemData.category !== 'Free' && {
      price: z
        .number()
        .min(1, { message: 'Price must be greater than 0' })
        .max(5000, { message: 'Price must be at most 5000' }),
    }),
    condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], { message: 'Condition is required' }),
    ...(asGuest && {
      firstName: z.string().trim().min(1, { message: 'First name is required' }).max(40),
      lastName: z.string().trim().max(50).optional(),
      phone: z
        .string()
        .trim()
        .min(MIN_PHONE_NUMBER_LENGTH, { message: `Phone number must be at least ${MIN_PHONE_NUMBER_LENGTH} digits` })
        .max(MAX_PHONE_NUMBER_LENGTH, { message: `Phone number must be at most ${MAX_PHONE_NUMBER_LENGTH} digits` })
        .regex(phoneRegex, { message: 'Phone number must start with + and include the country code' })
        .refine(value => validatePhoneNumber(value), { message: 'Invalid phone number' }),
    }),
  }),
)

const itemData = reactive({
  title: '',
  description: '',
  price: 0,
  condition: 'new',
  firstName: '',
  lastName: '',
  phone: '',
  category: '',
})

const isFormInvalid = computed(() => {
  const result = schema.value.safeParse(itemData)
  return !result.success || !imageFiles.value.length
})

const categoryNames = computed(() => categories.map(c => c.name))

function onClose() {
  emit('close', false)
}

function handleImgChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (target.files) {
    const selectedFiles = Array.from(target.files)

    if (selectedFiles.length > 3) {
      toast.add({ color: 'red', title: 'You can only upload up to 3 images', timeout: 2000 })
      return
    }

    imageFiles.value = []
    imagePreviews.value = []

    selectedFiles.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        compressImage(file, 0.7)
          .then(compressedBlob => {
            const compressedFile = new File([compressedBlob], file.name, { type: file.type })
            imageFiles.value.push(compressedFile)

            imagePreviews.value.push(URL.createObjectURL(compressedFile))
          })
          .catch(err => {
            console.log('Failed to compress image:', err)

            toast.add({ color: 'red', title: 'Failed to compress the image', timeout: 3000 })
          })
      } else {
        imageFiles.value.push(file)
        imagePreviews.value.push(URL.createObjectURL(file))
      }
    })
  } else {
    imagePreviews.value = []
    imageFiles.value = []
  }
}

async function onSubmit() {
  buttonLoading.value = true
  const categoryId = categories.find(c => c.name === itemData.category)?.id

  try {
    if (asGuest) {
      await $fetch('/api/auth/guestLogin', {
        method: 'POST',
        body: { firstName: itemData.firstName, lastName: itemData.lastName || '', phone: itemData.phone },
      })
    }

    const formData = new FormData()
    if (imageFiles.value.length) {
      imageFiles.value.forEach((file, index) => {
        formData.append(`image_${index}`, file)
      })
      formData.append('title', itemData.title)
      formData.append('description', itemData.description)
      formData.append('price', itemData.price.toString())
      formData.append('condition', itemData.condition)
      formData.append('category_id', categoryId!)
    }

    const { message } = await $fetch('/api/items', { method: 'POST', body: formData })

    toast.add({ color: 'green', title: message, timeout: 500 })
    setTimeout(() => {
      reloadNuxtApp({ path: '/profile/listings', force: true })
    }, 500)
  } catch (err: any) {
    console.log('Failed to create item:', err)
    toast.add({
      color: 'red',
      title: err.data.message || 'Failed to create letting, please try again later with valid data',
    })
  } finally {
    onClose()
  }

  watch(
    () => itemData.category,
    newCategory => {
      if (newCategory === 'free') {
        itemData.price = 0
      }
    },
  )
}
</script>

<template>
  <UModal>
    <template #default>
      <!-- Modal Overlay (provided by UModal) -->
      <div class="modal-container">
        <!-- Modal Content -->
        <div class="relative modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
          <button
            @click="onClose"
            class="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-transparent p-1 rounded-full focus:outline-none"
          >
            <Icon name="mdi:close" class="w-6 h-6" />
          </button>
          <div class="p-6">
            <form class="flex flex-col w-full text-center">
              <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">Create Item</h3>
              <p class="mb-4 text-gray-700 dark:text-gray-300">Fill in the details to list an item</p>

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
                      <UInput v-model="itemData.firstName" placeholder="First name" />
                    </UFormGroup>

                    <UFormGroup label="Last Name" name="lastName" class="w-1/2">
                      <UInput v-model="itemData.lastName" placeholder="Last name" />
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
                      @input="onPhoneInput"
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
                  <UInput v-model="itemData.title" placeholder="Shot title (max 20 characters)" />
                </UFormGroup>

                <UFormGroup class="mt-3" label="Description" name="description">
                  <UInput v-model="itemData.description" placeholder="Item description (max length: 100 characters)" />
                </UFormGroup>
                <UFormGroup class="mt-3" label="Category" name="category" required>
                  <USelectMenu v-model="itemData.category" :options="categoryNames" />
                </UFormGroup>

                <div class="mt-3">
                  <label for="imageInput" class="relative cursor-pointer">
                    <!-- Use UCarousel for image previews -->
                    <UCarousel
                      v-if="imagePreviews.length"
                      :items="imagePreviews"
                      arrows
                      :ui="{ item: 'basis-full' }"
                      class="rounded-lg overflow-hidden"
                    >
                      <template v-slot="{ item }">
                        <img :src="item" alt="Item Image" class="w-full h-40 object-cover rounded-lg" draggable="true" />
                      </template>
                    </UCarousel>

                    <div v-else class="flex items-center justify-center w-full h-14 bg-gray-200 rounded-lg">
                      <span class="text-gray-500">Click to upload images</span>
                    </div>
                  </label>
                  <input id="imageInput" type="file" class="hidden" @change="handleImgChange" multiple accept="image/*" />
                  <p class="text-sm text-gray-500 mt-1">Maximum of 3 images, size limit: 4 MB each</p>
                </div>

                <UFormGroup v-if="itemData.category !== 'Free'" class="mt-3" name="price">
                  <template #label>
                    <div class="flex items-center justify-start space-x-1">
                      <span>Price</span>
                      <span class="text-red-500">*</span>
                    </div>
                  </template>
                  <UInput v-model.number="itemData.price" type="number" placeholder="Price in euro (max 5000)" />
                </UFormGroup>

                <UFormGroup class="mt-3" label="Condition" name="condition">
                  <USelect
                    v-model="itemData.condition"
                    :options="['new', 'like new', 'very good', 'good', 'fair', 'poor']"
                  />
                </UFormGroup>
              </UForm>

              <UButton
                color="white"
                :loading="buttonLoading"
                :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
                class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
                label="Create Item"
                :ui="{
                  rounded: 'rounded-lg',
                  color: { white: { solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600' } },
                }"
                :disabled="isFormInvalid || itemData.category === ''"
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
  overflow-y: auto; /* Allow scrolling when content is too large */
}

.modal-content {
  pointer-events: auto;
  max-height: 90vh; /* Limit modal height to 90% of the viewport height */
  overflow-y: auto; /* Enable scrolling inside the modal if content exceeds the height */
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

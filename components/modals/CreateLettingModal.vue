<script setup lang="ts">
import z from 'zod'
import type { Category } from '~/server/database/drizzle'

const { categories, asGuest } = defineProps<{ categories: readonly Category[]; asGuest: boolean }>()

const emit = defineEmits<{ (e: 'close', success?: boolean): void }>()

const toast = useToast()

const buttonLoading = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const schema = computed(() =>
  z.object({
    title: z
      .string()
      .trim()
      .min(1, { message: 'Title is required' })
      .max(20, { message: 'Title must be at most 20 characters long' }),
    description: z.string().max(100, { message: 'Description must be at most 100 characters long' }).optional(),
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
        .min(10, { message: 'Phone number must be at least 10 digits' })
        .max(15, { message: 'Phone number must be at most 15 digits' })
        .regex(phoneRegex, { message: 'Phone number must start with + and include the country code' }),
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
  return !result.success || !imageFile.value
})

const categoryNames = computed(() => categories.map(c => c.name))

function onClose() {
  emit('close', false)
}

function handleImgChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (target.files && target.files[0]) {
    const file = target.files[0]

    // Check if file size exceeds 2 MB (This is for the original file, we will still try to compress it)
    if (file.size > 2 * 1024 * 1024) {
      // Compress the image before showing the preview and uploading
      compressImage(file, 0.7) // Compress the image at 70% quality
        .then(compressedBlob => {
          const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)

          // Check if the compressed image size exceeds 4 MB
          if (parseFloat(compressedSizeMB) > 4) {
            toast.add({ color: 'red', title: 'Compressed image size must be less than 4 MB' })
            // Reset the file input and the preview
            target.value = ''
            imageFile.value = null
            imagePreview.value = null
            return
          }

          imageFile.value = new File([compressedBlob], file.name, { type: file.type })

          const reader = new FileReader()
          reader.onload = () => {
            imagePreview.value = reader.result as string
          }
          reader.readAsDataURL(compressedBlob)
        })
        .catch(err => {
          toast.add({ color: 'red', title: err.data.message || 'Failed to compress the image' })
        })
    } else {
      // If file is within the size limit, just show the preview
      imageFile.value = file
      const reader = new FileReader()
      reader.onload = () => {
        imagePreview.value = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  } else {
    imagePreview.value = null
    imageFile.value = null
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
    if (imageFile.value && imageFile.value.size) {
      formData.append('image', imageFile.value!)
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
                    <div v-if="imagePreview">
                      <img :src="imagePreview" alt="Item Image" class="w-full h-40 object-cover rounded-lg" />
                    </div>
                    <div v-else class="flex items-center justify-center w-full h-14 bg-gray-200 rounded-lg">
                      <span class="text-gray-500">Click to upload image</span>
                    </div>
                  </label>
                  <input id="imageInput" type="file" class="hidden" @change="handleImgChange" accept="image/*" />
                  <p class="text-sm text-gray-500 mt-1">Maximum file size: 4 MB</p>
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

<script setup lang="ts">
import z from 'zod'
import type { Item } from '~/server/database/drizzle'

const { item: itemData } = defineProps<{
  item: Item & { category?: { name: string } | null }
  refreshItems: () => Promise<void>
}>()

const emit = defineEmits<{ (e: 'close', success?: boolean): void }>()

const toast = useToast()

const buttonLoading = ref(false)

const imageFiles = ref<File[]>([]) // New images selected by the user
const imagePreviews = ref<string[]>([]) // Previews of new images

// Zod schema for validation
const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(35, { message: 'Title must be at most 35 characters long' }),
  description: z.string().trim().max(200, { message: 'Description must be at most 200 characters long' }).optional(),
  price: z.number().min(1, { message: 'Price must be greater than 0' }).max(5000, { message: 'Price must be at most 5000' }),
  condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], { message: 'Condition is required' }),
  status: z.enum(['available', 'sold'], { message: 'Status is required' }),
})

const itemSchemaData = reactive({
  title: itemData.title,
  description: itemData.description || '',
  price: itemData.price,
  condition: itemData.condition || ('new' as Condition),
  status: itemData.status || ('available' as Status),
  category: itemData.category?.name,
})

const initialData = reactive({ ...itemSchemaData })

const isFormInvalid = computed(() => {
  const result = schema.safeParse(itemSchemaData)
  return !result.success
})

const isFormUnchanged = computed(() => {
  return (
    itemSchemaData.title === initialData.title &&
    itemSchemaData.description === initialData.description &&
    itemSchemaData.price === initialData.price &&
    itemSchemaData.condition === initialData.condition &&
    itemSchemaData.status === initialData.status &&
    imageFiles.value.length === 0
  )
})

// Only display the carousel if there are new image previews
const allImages = computed(() => imagePreviews.value)

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

    // Reset previous images
    imageFiles.value = []
    imagePreviews.value = []

    selectedFiles.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        compressImage(file, 0.7)
          .then(compressedBlob => {
            const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)

            if (parseFloat(compressedSizeMB) > 4) {
              toast.add({ color: 'red', title: 'Compressed image size must be less than 4 MB' })
              target.value = ''
              return
            }

            const compressedFile = new File([compressedBlob], file.name, { type: file.type })
            imageFiles.value.push(compressedFile)
            imagePreviews.value.push(URL.createObjectURL(compressedFile))
          })
          .catch(() => {
            toast.add({ color: 'red', title: 'Failed to compress the image' })
          })
      } else {
        // If file is within the size limit, just show the preview
        imageFiles.value.push(file)
        imagePreviews.value.push(URL.createObjectURL(file))
      }
    })
  } else {
    imagePreviews.value = []
    imageFiles.value = []
  }
}

function removeImage(index: number) {
  // Remove images from new image previews
  if (imagePreviews.value.length > 0) {
    imageFiles.value.splice(index, 1)
    imagePreviews.value.splice(index, 1)
  }
}

async function onSubmit() {
  buttonLoading.value = true

  try {
    const formData = new FormData()
    // Append new images
    if (imageFiles.value.length) {
      imageFiles.value.forEach((file, index) => {
        formData.append(`image_${index}`, file)
      })
    }

    formData.append('title', itemSchemaData.title.trim())
    formData.append('description', itemSchemaData.description.trim())
    formData.append('price', itemSchemaData.price.toString().trim())
    formData.append('condition', itemSchemaData.condition.trim())
    formData.append('status', itemSchemaData.status.trim())

    const { message } = await $fetch<{ statusCode: number; message: string }>(`/api/items/${itemData.id}`, {
      method: 'PATCH',
      body: formData,
    })

    toast.add({ color: 'green', title: message, timeout: 500 })
    setTimeout(() => {
      reloadNuxtApp({ path: '/profile/listings', force: true })
    }, 500)
  } catch (err: any) {
    console.log('Error:', err)
    toast.add({ color: 'red', title: err.data.message || 'Failed to update item, please try again.' })
  } finally {
    buttonLoading.value = false
  }
}
</script>

<template>
  <UModal>
    <div class="modal-container">
      <div class="relative modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
        <button
          @click="onClose"
          class="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-transparent p-1 rounded-full focus:outline-none"
        >
          <Icon name="mdi:close" class="w-6 h-6" />
        </button>

        <div class="p-6">
          <form class="flex flex-col w-full text-center">
            <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">Edit Item</h3>
            <p class="mb-4 text-gray-700 dark:text-gray-300">Update the details of your item</p>

            <UForm :schema="schema" :state="itemSchemaData">
              <UFormGroup class="mt-3" name="title">
                <template #label>
                  <div class="flex items-center justify-start space-x-1">
                    <span>Title</span>
                    <span class="text-red-500">*</span>
                  </div>
                </template>
                <UInput v-model="itemSchemaData.title" placeholder="Edit title (max 35 characters)" />
              </UFormGroup>

              <UFormGroup class="mt-3" label="Description" name="description">
                <UInput v-model="itemSchemaData.description" placeholder="Edit description (max length: 100 characters)" />
              </UFormGroup>

              <UFormGroup class="mt-3" label="Status" name="status">
                <USelect v-model="itemSchemaData.status" :options="['available', 'sold']" />
              </UFormGroup>

              <div class="mt-3">
                <label for="imageInput" class="relative cursor-pointer">
                  <!-- Use UCarousel for image previews -->
                  <ImageCarousel
                    v-if="imagePreviews.length"
                    type="arrows"
                    :images="imagePreviews"
                    :removable="true"
                    @removeImage="removeImage"
                  />

                  <div v-else class="flex items-center justify-center w-full h-14 bg-gray-200 rounded-lg">
                    <span class="text-gray-500">Click to upload images</span>
                  </div>
                </label>
                <input id="imageInput" type="file" class="hidden" @change="handleImgChange" multiple accept="image/*" />
                <p class="text-sm text-gray-500 mt-1">Maximum of 3 images, size limit: 4 MB each</p>
              </div>

              <UFormGroup class="mt-3" label="Price" name="price">
                <UInput v-model.number="itemSchemaData.price" type="number" placeholder="Edit price in euros" />
              </UFormGroup>

              <UFormGroup class="mt-3" label="Condition" name="condition">
                <USelect
                  v-model="itemSchemaData.condition"
                  :options="['new', 'like new', 'very good', 'good', 'fair', 'poor']"
                />
              </UFormGroup>
            </UForm>

            <UButton
              color="white"
              :loading="buttonLoading"
              :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
              class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
              label="Update Item"
              :ui="{ rounded: 'rounded-lg', color: { white: { solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600' } } }"
              :disabled="isFormInvalid || isFormUnchanged"
              @click="onSubmit"
            />
          </form>
        </div>
      </div>
    </div>
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

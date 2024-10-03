<script setup lang="ts">
import z from 'zod'
import type { Item } from '~/server/database/drizzle'

const { item } = defineProps<{
  item: Item & { category: { name: string } | null }
  refreshItems: () => Promise<void>
}>()

const emit = defineEmits<{ (e: 'close', success?: boolean): void }>()

const toast = useToast()
const store = useStore()

const { refetchItems, refetchMyItems, refetchLatestItems } = storeToRefs(store)

const buttonLoading = ref(false)
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

// Zod schema for validation
const schema = z.object({
  title: z
    .string()
    .min(1, { message: 'Title is required' })
    .max(20, { message: 'Title must be at most 20 characters long' }),
  description: z.string().max(100, { message: 'Description must be at most 100 characters long' }).optional(),
  price: z.number().min(1, { message: 'Price must be greater than 0' }).max(5000, { message: 'Price must be at most 5000' }),
  condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], { message: 'Condition is required' }),
})

const itemData = reactive({
  title: item.title,
  description: item.description || '',
  price: item.price,
  condition: item.condition || 'new',
  category: item.category?.name,
})

const initialData = reactive({ ...itemData })

const isFormInvalid = computed(() => {
  const result = schema.safeParse(itemData)
  return !result.success
})

const isFormUnchanged = computed(() => {
  return (
    itemData.title === initialData.title &&
    itemData.description === initialData.description &&
    itemData.price === initialData.price &&
    itemData.condition === initialData.condition &&
    imageFile.value === null // Check if no new image has been uploaded
  )
})

function onClose() {
  emit('close', false)
}

function handleImgChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (target.files && target.files[0]) {
    const file = target.files[0]
    const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2)
    console.log(`Original Image Size: ${originalSizeMB} MB`)

    // Check if file size exceeds 2 MB (This is for the original file, we will still try to compress it)
    if (file.size > 2 * 1024 * 1024) {
      compressImage(file, 0.7) // Compress the image at 70% quality
        .then(compressedBlob => {
          const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)
          console.log(`Compressed Image Size: ${compressedSizeMB} MB`)

          if (parseFloat(compressedSizeMB) > 4) {
            toast.add({ color: 'red', title: 'Compressed image size must be less than 4 MB' })
            target.value = '' // Reset the file input and the preview
            imageFile.value = null
            imagePreview.value = null
            return
          }

          // Set compressed image file
          imageFile.value = new File([compressedBlob], file.name, { type: file.type })

          // Show the image preview
          const reader = new FileReader()
          reader.onload = () => {
            imagePreview.value = reader.result as string
          }
          reader.readAsDataURL(compressedBlob)
        })
        .catch(() => {
          toast.add({ color: 'red', title: 'Failed to compress the image' })
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

  try {
    const formData = new FormData()
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }
    formData.append('title', itemData.title)
    formData.append('description', itemData.description)
    formData.append('price', itemData.price.toString())
    formData.append('condition', itemData.condition)

    const { message } = await $fetch<{ statusCode: number; message: string }>(`/api/items/${item.id}`, {
      method: 'PATCH',
      body: formData,
    })

    toast.add({ color: 'green', title: message })
    setTimeout(() => {
      reloadNuxtApp({ path: '/profile/listings' })
    }, 500)
  } catch (err) {
    console.log('Error:', err)
    toast.add({ color: 'red', title: 'Failed to update item, please try again.' })
  } finally {
    onClose()
    buttonLoading.value = false
  }
}
</script>

<template>
  <UModal>
    <div class="modal-container">
      <div class="modal-content bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md">
        <div class="p-6">
          <form class="flex flex-col w-full text-center">
            <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">Edit Item</h3>
            <p class="mb-4 text-gray-700 dark:text-gray-300">Update the details of your item</p>

            <UForm :schema="schema" :state="itemData">
              <UFormGroup class="mt-3" name="title">
                <template #label>
                  <div class="flex items-center justify-start space-x-1">
                    <span>Title</span>
                    <span class="text-red-500">*</span>
                  </div>
                </template>
                <UInput v-model="itemData.title" placeholder="Edit title (max 20 characters)" />
              </UFormGroup>

              <UFormGroup class="mt-3" label="Description" name="description">
                <UInput v-model="itemData.description" placeholder="Edit description (max length: 100 characters)" />
              </UFormGroup>

              <div class="mt-3">
                <label for="imageInput" class="relative cursor-pointer">
                  <div v-if="imagePreview">
                    <img :src="imagePreview" alt="Item Image" class="w-full h-40 object-cover rounded-lg" />
                  </div>
                  <div v-else class="flex items-center justify-center w-full h-14 bg-gray-200 rounded-lg">
                    <span class="text-gray-500">Click to upload new image</span>
                  </div>
                </label>
                <input id="imageInput" type="file" class="hidden" @change="handleImgChange" accept="image/*" />
                <p class="text-sm text-gray-500 mt-1">Maximum file size: 4 MB</p>
              </div>

              <UFormGroup class="mt-3" label="Price" name="price">
                <UInput v-model.number="itemData.price" type="number" placeholder="Edit price in euros" />
              </UFormGroup>

              <UFormGroup class="mt-3" label="Condition" name="condition">
                <USelect v-model="itemData.condition" :options="['new', 'like new', 'very good', 'good', 'fair', 'poor']" />
              </UFormGroup>
            </UForm>

            <UButton
              color="white"
              :loading="buttonLoading"
              :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
              class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
              label="Update Item"
              :ui="{
                rounded: 'rounded-lg',
                color: {
                  white: {
                    solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600',
                  },
                },
              }"
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

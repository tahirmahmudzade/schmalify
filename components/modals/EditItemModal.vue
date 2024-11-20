<script setup lang="ts">
import z from 'zod'
import type { Item } from '~/server/database/drizzle'

const { item: itemData } = defineProps<{
  item: Item & { category?: { name: string } | null }
  refreshItems: () => Promise<void>
}>()

const emit = defineEmits<{ (e: 'close', success?: boolean): void }>()

const { t } = useI18n()
const toast = useToast()
const { data: categoryData, error: categoryError } = await useFetch('/api/category')

if (!categoryData.value && categoryError.value) {
  toast.add({ color: 'red', title: t('Something went wrong, please try again or contact support') })
  throw createError({
    statusCode: 500,
    message: 'Failed to fetch categories',
  })
}

const buttonLoading = ref(false)

const imageFiles = ref<File[]>([]) // New images selected by the user
const imagePreviews = ref<string[]>([]) // Previews of new images

const conditionOptions = computed(() => [
  { value: 'new', label: t('New') },
  { value: 'like new', label: t('Like New') },
  { value: 'very good', label: t('Very Good') },
  { value: 'good', label: t('Good') },
  { value: 'fair', label: t('Fair') },
  { value: 'poor', label: t('Poor') },
])

const categoryOptions = computed(() => categoryData.value?.categories.map(c => ({ value: c.name, label: t(c.name) })))

const statusOptions = computed(() => [
  { value: 'available', label: t('Available') },
  { value: 'sold', label: t('Sold') },
])

// Zod schema for validation
const schema = computed(() => {
  const baseSchema: {
    title: z.ZodString
    description: z.ZodOptional<z.ZodString>
    condition: z.ZodEnum<['new', 'like new', 'very good', 'good', 'fair', 'poor']>
    status: z.ZodEnum<['available', 'sold']>
    category: z.ZodString
    price?: z.ZodNumber
  } = {
    title: z
      .string()
      .trim()
      .min(1, { message: t('Title is required') })
      .max(35, { message: t('Title must be at most 35 characters long') }),
    description: z
      .string()
      .trim()
      .max(200, { message: t('Description must be at most 200 characters long') })
      .optional(),
    condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], { message: t('Condition is required') }),
    status: z.enum(['available', 'sold'], { message: t('Status is required') }),
    category: z.string().min(1, { message: t('Category is required') }),
  }

  if (itemSchemaData.category !== 'Free') {
    baseSchema.price = z
      .number()
      .min(1, { message: t('Price must be greater than 0') })
      .max(5000, { message: t('Price must be at most 5000') })
  }

  return z.object(baseSchema)
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
  const result = schema.value.safeParse(itemSchemaData)
  return !result.success
})

const isFormUnchanged = computed(() => {
  return (
    itemSchemaData.title === initialData.title &&
    itemSchemaData.description === initialData.description &&
    (itemSchemaData.price === initialData.price || itemSchemaData.category === 'Free') &&
    itemSchemaData.condition === initialData.condition &&
    itemSchemaData.status === initialData.status &&
    imageFiles.value.length === 0 &&
    itemSchemaData.category === initialData.category
  )
})

function onClose() {
  emit('close', false)
}

function handleImgChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (target.files) {
    const selectedFiles = Array.from(target.files)

    // Adjust the image count check
    if (imageFiles.value.length + selectedFiles.length > 3) {
      toast.add({ color: 'red', title: t('You can only upload up to 3 images'), timeout: 2000 })
      target.value = ''
      return
    }

    selectedFiles.forEach(file => {
      if (file.size > 2 * 1024 * 1024) {
        compressImage(file, 0.7)
          .then(compressedBlob => {
            const compressedSizeMB = (compressedBlob.size / (1024 * 1024)).toFixed(2)

            if (parseFloat(compressedSizeMB) > 4) {
              toast.add({ color: 'red', title: t('Compressed image size must be less than 4 MB') })
              target.value = ''
              return
            }

            const compressedFile = new File([compressedBlob], file.name, { type: file.type })
            imageFiles.value.push(compressedFile)
            imagePreviews.value.push(URL.createObjectURL(compressedFile))
          })
          .catch(() => {
            toast.add({ color: 'red', title: t('Failed to compress the image') })
          })
      } else {
        imageFiles.value.push(file)
        imagePreviews.value.push(URL.createObjectURL(file))
      }
    })

    // Clear the input value to allow re-selection of the same file if needed
    target.value = ''
  }
}

function removeImage(index: number) {
  if (imagePreviews.value.length > 0) {
    imageFiles.value.splice(index, 1)
    imagePreviews.value.splice(index, 1)
  }
}

async function onSubmit() {
  buttonLoading.value = true
  const categoryId = categoryData.value?.categories.find(c => c.name === itemSchemaData.category)?.id

  if (!categoryId) {
    toast.add({ color: 'red', title: t('Category not found') })
    buttonLoading.value = false
    return
  }

  try {
    const formData = new FormData()
    if (imageFiles.value.length) {
      imageFiles.value.forEach((file, index) => {
        formData.append(`image_${index}`, file)
      })
    }

    formData.append('title', itemSchemaData.title.trim())
    formData.append('description', itemSchemaData.description.trim())
    formData.append('price', itemSchemaData.category === 'Free' ? '0' : itemSchemaData.price.toString().trim())
    formData.append('condition', itemSchemaData.condition.trim())
    formData.append('status', itemSchemaData.status.trim())
    formData.append('category', categoryId?.trim())

    const { message } = await $fetch<{ statusCode: number; message: string }>(`/api/items/${itemData.id}`, {
      method: 'PATCH',
      body: formData,
    })

    toast.add({ color: 'green', title: t(message), timeout: 500 })
    setTimeout(() => {
      reloadNuxtApp({ path: '/profile/listings', force: true })
    }, 500)
  } catch (err: any) {
    console.log('Error:', err)
    toast.add({ color: 'red', title: t(err.data.message) || t('Failed to update item, please try again.') })
  } finally {
    buttonLoading.value = false
  }
}
</script>

<template>
  <UModal :ui="{ container: 'flex min-h-full items-center justify-center text-center' }">
    <div>
      <button
        @click="onClose"
        class="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-transparent p-1 rounded-full focus:outline-none"
      >
        <Icon name="mdi:close" class="w-6 h-6" />
      </button>

      <div class="p-6">
        <form class="flex flex-col w-full text-center">
          <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">{{ t('Edit Item') }}</h3>
          <p class="mb-4 text-gray-700 dark:text-gray-300">{{ t('Update the details of your item') }}</p>

          <UForm :schema="schema" :state="itemSchemaData">
            <UFormGroup class="mt-3" name="title">
              <template #label>
                <div class="flex items-center justify-start space-x-1">
                  <span>{{ t('Title') }}</span>
                  <span class="text-red-500">*</span>
                </div>
              </template>
              <UInput v-model="itemSchemaData.title" :placeholder="t('Edit title (max 35 characters)')" />
            </UFormGroup>

            <UFormGroup class="mt-3" :label="t('Description')" name="description">
              <UInput
                v-model="itemSchemaData.description"
                :placeholder="t('Edit description (max length: 100 characters)')"
              />
            </UFormGroup>

            <UFormGroup class="mt-3" :label="t('Status')" name="status">
              <USelect v-model="itemSchemaData.status" :options="statusOptions" />
            </UFormGroup>

            <UFormGroup class="mt-3" :label="t('Category')" name="category">
              <USelect
                v-model="itemSchemaData.category"
                :options="categoryOptions"
                optionAttribute="label"
                valueAttribute="value"
              />
            </UFormGroup>

            <div class="mt-3">
              <label for="imageInput" class="relative cursor-pointer">
                <div @click.stop>
                  <ImageCarousel
                    v-if="imagePreviews.length"
                    type="arrows"
                    :images="imagePreviews"
                    :removable="true"
                    @removeImage="removeImage"
                  />
                  <div v-else class="flex items-center justify-center w-full h-14 bg-gray-200 rounded-lg">
                    <span class="text-gray-500">{{ t('Click to upload images') }}</span>
                  </div>
                </div>
              </label>
              <input id="imageInput" type="file" class="hidden" @change="handleImgChange" multiple accept="image/*" />
              <p class="text-sm text-gray-500 mt-1">{{ t('Maximum of 3 images, size limit: 4 MB each') }}</p>
            </div>

            <UFormGroup v-if="itemSchemaData.category !== 'Free'" class="mt-3" :label="t('Price')" name="price">
              <UInput v-model.number="itemSchemaData.price" type="number" :placeholder="t('Edit price in euros')" />
            </UFormGroup>

            <UFormGroup class="mt-3" :label="t('Condition')" name="condition">
              <USelect v-model="itemSchemaData.condition" :options="conditionOptions" />
            </UFormGroup>
          </UForm>

          <UButton
            color="white"
            :loading="buttonLoading"
            :icon="isFormInvalid || isFormUnchanged ? 'i-flat-color-icons-lock' : ''"
            class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
            :label="t('Update Item')"
            :ui="{ rounded: 'rounded-lg', color: { white: { solid: 'disabled:bg-gray-400 dark:disabled:bg-gray-600' } } }"
            :disabled="isFormInvalid || isFormUnchanged"
            @click="onSubmit"
          />
        </form>
      </div>
    </div>
  </UModal>
</template>

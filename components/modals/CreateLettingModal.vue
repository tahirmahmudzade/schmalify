<script setup lang="ts">
import z from 'zod'
import type { Category } from '~/server/database/drizzle'

const { categories, asGuest } = defineProps<{ categories: readonly Category[]; asGuest: boolean }>()

const emit = defineEmits<{ (e: 'close', success?: boolean): void }>()

const { t } = useI18n()
const toast = useToast()

const buttonLoading = ref(false)
const imageFiles = ref<File[]>([]) // Store an array of images
const imagePreviews = ref<string[]>([])

function onPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  input.value = input.value.replace(/[^0-9+]/g, '') // Only allow + and numbers
}

const conditionOptions = computed(() => [
  { value: 'new', label: t('New') },
  { value: 'like new', label: t('Like New') },
  { value: 'very good', label: t('Very Good') },
  { value: 'good', label: t('Good') },
  { value: 'fair', label: t('Fair') },
  { value: 'poor', label: t('Poor') },
])

const schema = computed(() =>
  z.object({
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
    ...(itemData.category !== 'Free' && {
      price: z
        .number()
        .min(1, { message: t('Price must be greater than 0') })
        .max(5000, { message: t('Price must be at most 5000') }),
    }),
    condition: z.enum(['new', 'like new', 'very good', 'good', 'fair', 'poor'], { message: t('Condition is required') }),
    ...(asGuest && {
      firstName: z
        .string()
        .trim()
        .min(1, { message: t('First name is required') })
        .max(40),
      lastName: z.string().trim().max(50).optional(),
      phone: z
        .string()
        .trim()
        .min(MIN_PHONE_NUMBER_LENGTH, { message: t(`Phone number must be at least ${MIN_PHONE_NUMBER_LENGTH} digits`) })
        .max(MAX_PHONE_NUMBER_LENGTH, { message: t(`Phone number must be at most ${MAX_PHONE_NUMBER_LENGTH} digits`) })
        .regex(phoneRegex, { message: t('Phone number must start with + and include the country code') })
        .refine(value => validatePhoneNumber(value), { message: t('Invalid phone number') }),
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

const categoryOptions = computed(() => categories.map(c => ({ value: c.name, label: t(c.name) })))

function onClose() {
  emit('close', false)
}

function handleImgChange(e: Event) {
  const target = e.target as HTMLInputElement

  if (target.files) {
    const selectedFiles = Array.from(target.files)

    if (imageFiles.value.length + selectedFiles.length > 3) {
      toast.add({ color: 'red', title: t('You can only upload up to 3 images'), timeout: 2000 })
      target.value = ''
      return
    }

    selectedFiles.forEach(file => {
      console.log('before processing image size in mb: ', file.size / 1024 / 1024)
      console.log('before processing image name: ', file.name, 'type: ', file.type)

      processImageToWebP(file)
        .then(webpBlob => {
          const webpFile = new File([webpBlob], file.name.replace(/\.[^/.]+$/, '.webp'), { type: 'image/webp' })
          console.log('after processing image size in mb: ', webpFile.size / 1024 / 1024)
          console.log('after processing image name: ', webpFile.name, 'type: ', webpFile.type)

          imageFiles.value.push(webpFile)
          imagePreviews.value.push(URL.createObjectURL(webpFile))
        })
        .catch(err => {
          console.log('Failed to process image:', err)
          toast.add({ color: 'red', title: t('Failed to process the image'), timeout: 3000 })
        })
    })

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
  const categoryId = categories.find(c => c.name === itemData.category)?.id

  try {
    if (asGuest) {
      await $fetch('/api/auth/guestLogin', {
        method: 'POST',
        body: {
          firstName: itemData.firstName.trim(),
          lastName: itemData.lastName.trim() || '',
          phone: itemData.phone.trim(),
        },
      })
    }

    const formData = new FormData()
    if (imageFiles.value.length) {
      imageFiles.value.forEach((file, index) => {
        formData.append(`image_${index}`, file)
      })
      formData.append('title', itemData.title.trim())
      formData.append('description', itemData.description.trim())
      formData.append('price', itemData.price.toString().trim())
      formData.append('condition', itemData.condition.trim())
      formData.append('category_id', categoryId!.trim())
    }

    const { message } = await $fetch('/api/items', { method: 'POST', body: formData })

    toast.add({ color: 'green', title: t(message), timeout: 500 })
    setTimeout(() => {
      reloadNuxtApp({ path: '/profile/listings', force: true })
    }, 500)
  } catch (err: any) {
    console.log('Failed to create item:', err)
    toast.add({
      color: 'red',
      title: t(err.data.message) || t('Failed to create listing, please try again later with valid data'),
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
  <UModal :ui="{ container: 'flex min-h-full items-center justify-center text-center' }">
    <template #default>
      <div>
        <button
          @click="onClose"
          class="absolute top-2 right-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-transparent p-1 rounded-full focus:outline-none"
        >
          <Icon name="mdi:close" class="w-6 h-6" />
        </button>
        <div class="p-6">
          <form class="flex flex-col w-full text-center">
            <h3 class="mb-3 text-4xl font-extrabold text-gray-900 dark:text-gray-100">{{ t('Create Item') }}</h3>
            <p class="mb-4 text-gray-700 dark:text-gray-300">{{ t('Fill in the details to list an item') }}</p>

            <UForm :schema="schema" :state="itemData">
              <div v-if="asGuest">
                <div class="flex space-x-4">
                  <UFormGroup name="firstName" class="w-1/2">
                    <template #label>
                      <div class="flex items-center justify-start space-x-1">
                        <span>{{ t('First Name') }}</span>
                        <span class="text-red-500">*</span>
                      </div>
                    </template>
                    <UInput v-model="itemData.firstName" :placeholder="t('First Name')" />
                  </UFormGroup>

                  <UFormGroup :label="t('Last Name')" name="lastName" class="w-1/2">
                    <UInput v-model="itemData.lastName" :placeholder="t('Last Name')" />
                  </UFormGroup>
                </div>

                <UFormGroup class="mt-3" name="phone">
                  <template #label>
                    <div class="flex items-center justify-start space-x-1">
                      <span>{{ t('Phone Number') }}</span>
                      <span class="text-red-500">*</span>
                    </div>
                  </template>
                  <UInput
                    v-model="itemData.phone"
                    type="tel"
                    :placeholder="t('Number with country code (e.g. +495556667788)')"
                    @input="onPhoneInput"
                  />
                </UFormGroup>
              </div>

              <UFormGroup class="mt-3" name="title">
                <template #label>
                  <div class="flex items-center justify-start space-x-1">
                    <span>{{ t('Title') }}</span>
                    <span class="text-red-500">*</span>
                  </div>
                </template>
                <UInput v-model="itemData.title" :placeholder="t('Short title (max 35 characters)')" />
              </UFormGroup>

              <UFormGroup class="mt-3" :label="t('Description')" name="description">
                <UInput v-model="itemData.description" :placeholder="t('Item description (max length: 200 characters)')" />
              </UFormGroup>

              <UFormGroup class="mt-3" :label="t('Category')" name="category" required>
                <USelectMenu v-model="itemData.category" :options="categoryOptions" valueAttribute="value" />
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

              <UFormGroup v-if="itemData.category !== 'Free'" class="mt-3" name="price">
                <template #label>
                  <div class="flex items-center justify-start space-x-1">
                    <span>{{ t('Price') }}</span>
                    <span class="text-red-500">*</span>
                  </div>
                </template>
                <UInput v-model.number="itemData.price" type="number" :placeholder="t('Price in euro (max 5000)')" />
              </UFormGroup>

              <UFormGroup class="mt-3" :label="t('Condition')" name="condition">
                <USelect v-model="itemData.condition" :options="conditionOptions" />
              </UFormGroup>
            </UForm>

            <UButton
              color="white"
              :loading="buttonLoading"
              :icon="isFormInvalid ? 'i-flat-color-icons-lock' : ''"
              class="mt-5 py-2 justify-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-800 dark:hover:bg-gray-700 hover:text-white"
              :label="t('Create Item')"
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
    </template>
  </UModal>
</template>

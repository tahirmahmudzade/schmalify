import parsePhoneNumberFromString from 'libphonenumber-js'

export function getProfilePicUrl(avatar?: string | null, userId?: string | null): string {
  return avatar?.startsWith('https') ? avatar : `/api/blob/${userId}/serveProfile`
}

export function compressImage(file: File, quality: number = 0.7): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const reader = new FileReader()

    reader.readAsDataURL(file)
    reader.onload = event => {
      img.src = event.target?.result as string
    }

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!

      // Set canvas dimensions to match the image dimensions
      const width = img.width
      const height = img.height
      canvas.width = width
      canvas.height = height

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, height)

      // PNG guard: If the image is a PNG, skip compression or convert it to JPEG
      const outputType = file.type === 'image/png' ? 'image/jpeg' : file.type

      // Convert the canvas content to a Blob (compressed image)
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Compression failed'))
          }
        },
        outputType, // Use JPEG for PNGs or keep the original type for other formats
        file.type === 'image/png' ? 0.9 : quality, // Higher quality for converted PNGs
      )
    }

    img.onerror = error => reject(error)
  })
}

export function validatePhoneNumber(phone: string) {
  const phoneNumber = parsePhoneNumberFromString(phone)
  return phoneNumber ? phoneNumber.isValid() : false
}

export const handleImageError = (event: Event, entityType: 'item' | 'user' | 'category') => {
  const target = event.target as HTMLImageElement

  switch (entityType) {
    case 'item':
      target.src = '/img/items/default-item.webp'
      break
    case 'user':
      target.src = '/img/users/default-user.webp'
      break
    case 'category':
      target.src = '/img/categories/default-category.webp'
      break
    default:
      target.src = '/img/default-image.webp'
  }
}

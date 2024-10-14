import parsePhoneNumberFromString from 'libphonenumber-js'

export function getProfilePicUrl(avatar?: string | null, userId?: string | null): string {
  return avatar?.startsWith('https') ? avatar : `/api/users/${userId}/serveImg`
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

      // Convert the canvas content to a Blob (compressed image)
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Compression failed'))
          }
        },
        file.type, // Keep the original file type
        quality, // Compression quality (between 0 and 1, e.g., 0.7 for 70% quality)
      )
    }

    img.onerror = error => reject(error)
  })
}

export function validatePhoneNumber(phone: string) {
  const phoneNumber = parsePhoneNumberFromString(phone)
  return phoneNumber ? phoneNumber.isValid() : false
}

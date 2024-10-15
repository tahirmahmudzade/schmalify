export function processImage(image: File): string {
  if (!image || !image.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(image, { maxSize: '4MB', types: ['image'] })

  return processImageName(image.name)
}

export const processImageName = (name: string) => {
  return name.trim().toLowerCase().replace(/\s+/g, '_')
}

export default function processImage(image: File): void {
  if (!image || !image.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(image, { maxSize: '4MB', types: ['image'] })
}

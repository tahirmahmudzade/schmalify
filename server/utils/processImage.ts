export default function processImage(image: File): void {
  if (!image || !image.size) {
    throw createError({ statusCode: 400, message: 'No file provided' })
  }
  console.log('image size in mb:', image.size / 1024 / 1024)

  ensureBlob(image, { maxSize: '4MB', types: ['image'] })
}

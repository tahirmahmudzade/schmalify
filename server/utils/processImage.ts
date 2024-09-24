export default function processImage(image: File): void {
  if (!image || !image.size) {
    console.log('No file provided or file size is 0')

    throw createError({ statusCode: 400, message: 'No file provided' })
  }

  ensureBlob(image, {
    maxSize: '2MB',
    types: ['image'],
  })
}

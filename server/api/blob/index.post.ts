export default defineEventHandler(async event => {
  const form = await readFormData(event)

  const file = form.get('file') as File

  processImage(file)

  return hubBlob().put(file.name, file, { addRandomSuffix: false, prefix: 'images' })
})

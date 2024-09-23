export default defineEventHandler(async () => {
  const data = await hubBlob().list()

  return {
    status: 200,
    body: data,
  }
})

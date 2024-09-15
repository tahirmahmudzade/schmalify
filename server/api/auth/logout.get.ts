export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  await clearUserSession(event)

  return {
    statusCode: 200,
    message: 'Logout successful',
  }
})

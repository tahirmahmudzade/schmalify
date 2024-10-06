export default defineEventHandler(async (event): Promise<{ statusCode: number; message: string }> => {
  await requireUserSession(event)

  await clearUserSession(event)

  return { statusCode: 200, message: 'Logout successful' }
})

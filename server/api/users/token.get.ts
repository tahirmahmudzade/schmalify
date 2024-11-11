import { sign } from '@tsndr/cloudflare-worker-jwt'

export default defineEventHandler(async (event): Promise<{ tempToken: string }> => {
  const { user } = await requireUserSession(event)

  const tempToken = await sign(
    { userId: user.id, exp: Math.floor(Date.now() / 1000) + 5 * 60 },
    process.env.JWT_SECRET || 'prvscret',
  )

  return { tempToken }
})

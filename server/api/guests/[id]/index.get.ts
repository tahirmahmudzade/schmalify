import { Guest } from '~/server/database/drizzle'
import { getGuestById } from '~/server/service/guest'

export default defineEventHandler(
  async (
    event
  ): Promise<{
    statusCode: number
    guest?: Guest
  }> => {
    const paramId = getRouterParam(event, 'id')

    if (!paramId) {
      throw createError({
        statusCode: 400,
        message: 'Id is required',
      })
    }

    const guest = await getGuestById(parseInt(paramId))

    if (!guest) {
      throw createError({
        statusCode: 404,
        message: 'Guest not found',
      })
    }

    return {
      statusCode: 200,
      guest,
    }
  }
)

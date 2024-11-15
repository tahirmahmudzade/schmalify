import { getCategoryById } from '~/server/service/category'

export default defineEventHandler(async event => {
  const paramId = getRouterParam(event, 'id')

  if (!paramId) {
    throw createError({ statusCode: 400, message: 'No id provided' })
  }

  const decodedCategoryId = decodeId(paramId)

  try {
    const category = await getCategoryById(decodedCategoryId)

    if (!category || !category.img) {
      throw createError({ statusCode: 404, message: !category?.img ? 'Category has no img' : 'Category not found' })
    }

    const filename = category.img || `${paramId}/${category.img}`

    return hubBlob().serve(event, filename)
  } catch (err) {
    console.log('error getting category', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error getting category data' })
  }
})

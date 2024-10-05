import { getCategoryByName } from '~/server/service/category'

export default defineEventHandler(async event => {
  const name = getRouterParam(event, 'id')

  if (!name) {
    throw createError({ statusCode: 400, message: 'Missing category name' })
  }

  const categoryName = name.includes('-')
    ? name
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('-')
    : name.charAt(0).toUpperCase() + name.slice(1)

  const category = await getCategoryByName(categoryName)

  if (!category) {
    throw createError({ statusCode: 404, message: 'Category not found' })
  }

  return {
    statusCode: 200,
    category: {
      ...category,
      id: encodeId(category.id),
      items: category.items.map(item => ({
        ...item,
        id: encodeId(item.id),
        seller_id: encodeId(item.seller_id!),
        category_id: encodeId(item.category_id!),
      })),
    },
  }
})

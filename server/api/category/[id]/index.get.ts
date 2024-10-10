import { Category, Item } from '~/server/database/drizzle'
import { getCategoryByName } from '~/server/service/category'

export default defineEventHandler(async (event): Promise<{ statusCode: number; category: Category & { items: Item[] } }> => {
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

  try {
    const category = await getCategoryByName(categoryName)

    if (!category) {
      throw createError({ statusCode: 404, message: 'Category not found' })
    }

    const transformedCategory: Category & { items: Item[] } = {
      ...category,
      id: encodeId(category.id),
      items: category.items.map(item => ({
        ...item,
        id: encodeId(item.id),
        seller_id: encodeId(item.seller_id!),
        category_id: encodeId(item.category_id!),
      })),
    }

    return { statusCode: 200, category: transformedCategory }
  } catch (err) {
    console.log('error getting category', err)
    throw createError({ statusCode: 500, message: (err as string) || 'Error getting category data' })
  }
})

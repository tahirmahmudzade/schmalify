import { Category, CreateCategory, eq, tables, useDrizzle } from '../database/drizzle'
import useNanoId from '../utils/nanoId'

export function getAllCategories(): Promise<Category[]> {
  return useDrizzle().query.category.findMany()
}

export function getCategoryById(categoryId: string) {
  return useDrizzle().query.category.findFirst({
    where: eq(tables.category.id, categoryId),
    with: { items: true },
  })
}

export function getCategoryByName(categoryName: string) {
  return useDrizzle().query.category.findFirst({
    where: eq(tables.category.name, categoryName),
    with: { items: true },
  })
}

export function createCategory(categoryData: Omit<CreateCategory, 'id'>) {
  return useDrizzle()
    .insert(tables.category)
    .values({ ...categoryData, id: useNanoId(), img: categoryData.img || 'default-category.webp' })
    .returning({ id: tables.category.id, name: tables.category.name })
    .get()
}

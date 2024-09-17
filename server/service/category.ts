import { CreateCategory, eq, tables, useDrizzle } from '../database/drizzle'

export function getAllCategories() {
  return useDrizzle().query.category.findMany()
}

export function getCategoryById(categoryId: string) {
  return useDrizzle().query.category.findFirst({
    where: eq(tables.category.id, categoryId),
  })
}

export function getCategoryByName(categoryName: string) {
  return useDrizzle().query.category.findFirst({
    where: eq(tables.category.name, categoryName),
  })
}

export function createCategory(categoryData: Omit<CreateCategory, 'id'>) {
  return useDrizzle()
    .insert(tables.category)
    .values({
      id: nanoId(),
      ...categoryData,
    })
    .returning({
      id: tables.category.id,
      name: tables.category.name,
    })
    .get()
}

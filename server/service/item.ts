import { desc } from 'drizzle-orm'
import { CreateItem, eq, tables, UpdateItem, useDrizzle } from '../database/drizzle'
import useNanoId from '../utils/nanoId'

export function getAllItems() {
  return useDrizzle().query.item.findMany({
    with: { seller: { columns: { avatar: true, location: true } } },
  })
}

export function getLatestItems() {
  return useDrizzle().query.item.findMany({
    with: { seller: { columns: { avatar: true, location: true } } },
    orderBy: [desc(tables.item.createdAt)], // Order by createdAt in descending order
    limit: 10, // Limit the result to 15 items
  })
}

export function getItemById(itemId: string) {
  return useDrizzle().query.item.findFirst({
    where: eq(tables.item.id, itemId),
    with: { category: true, seller: true },
  })
}

export function getItemsByCategory(categoryId: string) {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.category_id, categoryId),
    with: { category: true, seller: true },
  })
}

export function getItemsBySeller(sellerId: string) {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.seller_id, sellerId),
    with: { category: true, seller: true },
  })
}

export function createItem(itemData: Omit<CreateItem, 'id'>) {
  return useDrizzle()
    .insert(tables.item)
    .values({ ...itemData, id: useNanoId() })
    .returning({ id: tables.item.id, title: tables.item.title })
    .get()
}

export function updateItemById(itemId: string, itemData: UpdateItem) {
  return useDrizzle().update(tables.item).set(itemData).where(eq(tables.item.id, itemId))
}

export function deleteItemById(itemId: string) {
  return useDrizzle().delete(tables.item).where(eq(tables.item.id, itemId))
}

export function updateItemPicture(itemId: string, fileName: string) {
  return useDrizzle().update(tables.item).set({ image: fileName }).where(eq(tables.item.id, itemId))
}

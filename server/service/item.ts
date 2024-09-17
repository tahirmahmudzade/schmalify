import { nanoid } from 'nanoid'
import {
  CreateItem,
  eq,
  tables,
  UpdateItem,
  useDrizzle,
} from '../database/drizzle'

export default function getAllItems() {
  return useDrizzle().query.item.findMany({
    with: {
      category: true,
      seller: true,
      guest: true,
    },
  })
}

export function getItemById(itemId: string) {
  return useDrizzle().query.item.findFirst({
    where: eq(tables.item.id, itemId),
    with: {
      category: true,
      seller: true,
      guest: true,
    },
  })
}

export function getItemsByCategory(categoryId: string) {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.category_id, categoryId),
    with: {
      category: true,
      seller: true,
      guest: true,
    },
  })
}

export function getItemsBySeller(sellerId: string) {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.seller_id, sellerId),
    with: {
      category: true,
      seller: true,
      guest: true,
    },
  })
}

export function getItemsByGuest(guestId: number) {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.guest_id, guestId),
    with: {
      category: true,
      seller: true,
      guest: true,
    },
  })
}

export function createItem(
  itemData: Omit<CreateItem, 'id'>,
  userId?: string,
  guestId?: number
) {
  const values = {
    ...itemData,
    id: nanoid(),
    seller_id: userId || undefined,
    guest_id: !userId && guestId ? guestId : undefined,
  }

  return useDrizzle()
    .insert(tables.item)
    .values(values)
    .returning({
      id: tables.item.id,
      title: tables.item.title,
    })
    .get()
}

export function updateItemById(itemId: string, itemData: UpdateItem) {
  return useDrizzle()
    .update(tables.item)
    .set(itemData)
    .where(eq(tables.item.id, itemId))
}

export function deleteItemById(itemId: string) {
  return useDrizzle().delete(tables.item).where(eq(tables.item.id, itemId))
}

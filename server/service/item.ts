import { desc, like, or } from 'drizzle-orm'
import { CreateItem, eq, Item, tables, UpdateItem, useDrizzle } from '../database/drizzle'
import useNanoId from '../utils/nanoId'

export function getAllItems(
  searchQuery: string | undefined,
  limit: number,
  offset: number,
): Promise<(Item & { seller: { avatar: string | null; location: string | null } | null })[]> {
  const whereClause = searchQuery
    ? or(
        like(tables.item.title, `%${searchQuery}%`), // Search in title
        like(tables.item.description, `%${searchQuery}%`), // Search in description
      )
    : undefined

  return useDrizzle().query.item.findMany({
    where: whereClause,
    limit,
    offset,
    orderBy: [desc(tables.item.createdAt)],
    with: { seller: { columns: { avatar: true, location: true } } },
  })
}

export function getLatestItems(): Promise<(Item & { seller: { avatar: string | null; location: string | null } | null })[]> {
  return useDrizzle().query.item.findMany({
    with: { seller: { columns: { avatar: true, location: true } } },
    orderBy: [desc(tables.item.createdAt)], // Order by createdAt in descending order
    limit: 10, // Limit the result to 15 items
  })
}

export function getItemById(itemId: string): Promise<
  | (Item & {
      category: { name: string } | null
      seller: {
        avatar: string | null
        location: string | null
        lastName: string | null
        firstName: string | null
        phone: string | null
        username: string | null
      } | null
    })
  | undefined
> {
  return useDrizzle().query.item.findFirst({
    where: eq(tables.item.id, itemId),
    with: {
      category: { columns: { name: true } },
      seller: {
        columns: {
          avatar: true,
          location: true,
          lastName: true,
          firstName: true,
          email: true,
          phone: true,
          username: true,
        },
      },
    },
  })
}

export function getItemsByCategory(categoryId: string): Promise<
  (Item & {
    category: { name: string } | null
    seller: {
      avatar: string | null
      location: string | null
      lastName: string | null
      firstName: string | null
      phone: string | null
      username: string | null
    } | null
  })[]
> {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.category_id, categoryId),
    with: {
      category: { columns: { name: true } },
      seller: {
        columns: {
          avatar: true,
          location: true,
          lastName: true,
          firstName: true,
          email: true,
          phone: true,
          username: true,
        },
      },
    },
  })
}

export function getItemsBySeller(sellerId: string): Promise<
  (Item & {
    category: { name: string } | null
    seller: {
      avatar: string | null
      location: string | null
      lastName: string | null
      firstName: string | null
      phone: string | null
      username: string | null
    } | null
  })[]
> {
  return useDrizzle().query.item.findMany({
    where: eq(tables.item.seller_id, sellerId),
    with: {
      category: true,
      seller: {
        columns: {
          avatar: true,
          location: true,
          lastName: true,
          firstName: true,
          email: true,
          phone: true,
          username: true,
        },
      },
    },
  })
}

export function getItemImages(itemId: string): Promise<{ images: string[] | null } | undefined> {
  return useDrizzle().query.item.findFirst({ where: eq(tables.item.id, itemId), columns: { images: true } })
}

export function getItemSellerId(itemId: string): Promise<{ seller_id: string | null } | undefined> {
  return useDrizzle().query.item.findFirst({ where: eq(tables.item.id, itemId), columns: { seller_id: true } })
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

export function updateItemPicture(itemId: string, imageNames: string[]) {
  return useDrizzle().update(tables.item).set({ images: imageNames }).where(eq(tables.item.id, itemId))
}

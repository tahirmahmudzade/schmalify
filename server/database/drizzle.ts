import { drizzle } from 'drizzle-orm/d1'

import * as schema from '../database/schema'

export { and, eq, or, sql } from 'drizzle-orm'

export const tables = schema

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema })
}

export type User = typeof schema.user.$inferSelect
export type CreateUser = typeof schema.user.$inferInsert
export type UpdateUser = Partial<CreateUser>

export type Guest = typeof schema.guest.$inferSelect
export type CreateGuest = typeof schema.guest.$inferInsert
export type UpdateGuest = Partial<CreateGuest>

export type Item = typeof schema.item.$inferSelect
export type CreateItem = typeof schema.item.$inferInsert
export type UpdateItem = Partial<CreateItem>

export type Category = typeof schema.category.$inferSelect
export type CreateCategory = typeof schema.category.$inferInsert
export type UpdateCategory = Partial<CreateCategory>

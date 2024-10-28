import { count } from 'drizzle-orm'
import { CreateUser, eq, Item, tables, UpdateUser, useDrizzle, User } from '../database/drizzle'
import useNanoId from '../utils/nanoId'

export function getUsers() {
  return useDrizzle().query.user.findMany({ with: { items: true } })
}

export function getUserById(
  userId: string,
): Promise<(User & { items: (Item & { category: { name: string } | null })[] }) | undefined> {
  return useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
    with: { items: { with: { category: { columns: { name: true } } } } },
  })
}

export function getUserByEmail(userEmail: string) {
  return useDrizzle().query.user.findFirst({ where: eq(tables.user.email, userEmail) })
}

export function getUserPhone(userId: string) {
  return useDrizzle().query.user.findFirst({ where: eq(tables.user.id, userId), columns: { phone: true } })
}

export function getUserImage(userId: string) {
  return useDrizzle().query.user.findFirst({ where: eq(tables.user.id, userId), columns: { avatar: true } })
}

export function getUserItemsCount(userId: string) {
  return useDrizzle().select({ count: count() }).from(tables.item).where(eq(tables.item.seller_id, userId))
}

export function createUser(userData: Omit<CreateUser, 'id'>) {
  return useDrizzle()
    .insert(tables.user)
    .values({ ...userData, id: useNanoId(), avatar: userData.avatar || 'default-user.webp' })
    .returning({ email: tables.user.email, id: tables.user.id, username: tables.user.username, avatar: tables.user.avatar })
    .get()
}

export function updateUserById(userId: string, userData: UpdateUser) {
  return useDrizzle().update(tables.user).set(userData).where(eq(tables.user.id, userId)).returning().get()
}

export function deleteUserById(userId: string) {
  return useDrizzle().delete(tables.user).where(eq(tables.user.id, userId)).returning().get()
}

export function updateProfilePicture(userId: string, fileName: string) {
  return useDrizzle().update(tables.user).set({ avatar: fileName }).where(eq(tables.user.id, userId))
}

export function updatePassword(userId: string, password: string) {
  return useDrizzle().update(tables.user).set({ password, passwordResetToken: null }).where(eq(tables.user.id, userId))
}

export function updateUserResetToken(userId: string, token: string) {
  return useDrizzle().update(tables.user).set({ passwordResetToken: token }).where(eq(tables.user.id, userId))
}

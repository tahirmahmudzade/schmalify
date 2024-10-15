import { CreateUser, eq, tables, UpdateUser, useDrizzle } from '../database/drizzle'
import useNanoId from '../utils/nanoId'

export const getUsers = async () => {
  return useDrizzle().query.user.findMany({ with: { items: true } })
}

export const getUserById = async (userId: string) => {
  return useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
    with: { items: { with: { category: { columns: { name: true } } } } },
  })
}

export const getUserByEmail = async (userEmail: string) => {
  return useDrizzle().query.user.findFirst({ where: eq(tables.user.email, userEmail) })
}

export const getUserPhone = async (userId: string) => {
  return useDrizzle().query.user.findFirst({ where: eq(tables.user.id, userId), columns: { phone: true } })
}

export const getUserImage = async (userId: string) => {
  return useDrizzle().query.user.findFirst({ where: eq(tables.user.id, userId), columns: { avatar: true } })
}

export const createUser = async (userData: Omit<CreateUser, 'id'>) => {
  return useDrizzle()
    .insert(tables.user)
    .values({ ...userData, id: useNanoId(), avatar: userData.avatar || 'default-user.webp' })
    .returning({ email: tables.user.email, id: tables.user.id, username: tables.user.username, avatar: tables.user.avatar })
    .get()
}

export const updateUserById = async (userId: string, userData: UpdateUser) => {
  return useDrizzle().update(tables.user).set(userData).where(eq(tables.user.id, userId)).returning().get()
}

export const deleteUserById = async (userId: string) => {
  return useDrizzle().delete(tables.user).where(eq(tables.user.id, userId)).returning().get()
}

export const updateProfilePicture = async (userId: string, fileName: string) => {
  return useDrizzle().update(tables.user).set({ avatar: fileName }).where(eq(tables.user.id, userId))
}

export const updatePassword = async (userId: string, password: string) => {
  return useDrizzle().update(tables.user).set({ password }).where(eq(tables.user.id, userId))
}

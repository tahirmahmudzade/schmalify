import {
  CreateUser,
  eq,
  tables,
  UpdateUser,
  useDrizzle,
} from '../database/drizzle'
import useNanoId from '../utils/nanoId'

export const getUsers = async () => {
  return useDrizzle().query.user.findMany({
    with: {
      items: true,
    },
  })
}

export const getUserById = async (userId: string) => {
  return useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
    with: {
      items: true,
    },
  })
}

export const getUserByEmail = async (userEmail: string) => {
  return useDrizzle().query.user.findFirst({
    where: eq(tables.user.email, userEmail),
  })
}

export const createUser = async (userData: Omit<CreateUser, 'id'>) => {
  return useDrizzle()
    .insert(tables.user)
    .values({
      id: useNanoId(),
      ...userData,
    })
    .returning({
      email: tables.user.email,
      id: tables.user.id,
      username: tables.user.username,
    })
    .get()
}

export const updateUserById = async (userId: string, userData: UpdateUser) => {
  return useDrizzle()
    .update(tables.user)
    .set(userData)
    .where(eq(tables.user.id, userId))
    .returning()
    .get()
}

export const deleteUserById = async (userId: string) => {
  return useDrizzle()
    .delete(tables.user)
    .where(eq(tables.user.id, userId))
    .returning()
    .get()
}

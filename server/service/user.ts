import {
  CreateUser,
  eq,
  tables,
  UpdateUser,
  useDrizzle,
} from '../database/drizzle'

export const getUsers = async (withItems: boolean = false) => {
  return useDrizzle().query.user.findMany({
    ...(withItems && {
      with: {
        items: true,
      },
    }),
  })
}

export const getUserById = async (
  userId: string,
  withItems: boolean = false
) => {
  return useDrizzle().query.user.findFirst({
    where: eq(tables.user.id, userId),
    ...(withItems && {
      with: {
        items: true,
      },
    }),
  })
}

export const getUserByEmail = async (userEmail: string) => {
  return useDrizzle().query.user.findFirst({
    where: eq(tables.user.email, userEmail),
  })
}

export const createUser = async (userData: CreateUser) => {
  return useDrizzle()
    .insert(tables.user)
    .values(userData)
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
}

export const deleteUserById = async (userId: string) => {
  return useDrizzle()
    .delete(tables.user)
    .where(eq(tables.user.id, userId))
    .returning()
    .get()
}

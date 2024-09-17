import { CreateGuest, eq, tables, useDrizzle } from '../database/drizzle'

export function getAllGuests() {
  return useDrizzle().query.guest.findMany()
}

export function getGuestById(guestId: number) {
  return useDrizzle().query.guest.findFirst({
    where: eq(tables.guest.id, guestId),
  })
}

export function createGuest(guestData: CreateGuest) {
  return useDrizzle()
    .insert(tables.guest)
    .values(guestData)
    .returning({ id: tables.guest.id, firstName: tables.guest.firstName })
    .get()
}

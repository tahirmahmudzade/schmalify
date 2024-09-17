import type { Guest } from './server/database/drizzle'

declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    username: string
  }

  interface UserSession {
    loggedInAt: string
    guest?: Guest
  }
}

export {}

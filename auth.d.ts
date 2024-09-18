import type { Guest } from './server/database/drizzle'

declare module '#auth-utils' {
  interface User {
    id: string
    email?: string
    username?: string
    isGuest: boolean
  }

  interface UserSession {
    loggedInAt: string
  }
}

export {}

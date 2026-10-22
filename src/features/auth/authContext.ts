import type { User } from '@/shared/api/jsonplaceholder/types'
import { createStrictContext } from '@/shared/lib/createStrictContext'

export type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  /** Throws when the credentials are not valid. */
  login: (username: string, password: string) => Promise<User>
  logout: () => void
}

export const [AuthContext, useAuth] = createStrictContext<AuthContextValue>('Auth')

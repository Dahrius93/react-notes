import { useCallback, useMemo, type ReactNode } from 'react'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { findUserByUsername } from '@/shared/api/jsonplaceholder/users'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import { AuthContext, type AuthContextValue } from './authContext'

type AuthProviderProps = {
  children: ReactNode
  /** localStorage key of the session. Demos use their own key to stay isolated from the app. */
  storageKey?: string
}

/**
 * Fake authentication on top of JSONPlaceholder: any existing username
 * (e.g. "Bret") with any non-empty password logs in.
 * The user is kept in localStorage, so the session survives reloads.
 */
export function AuthProvider({ children, storageKey = 'react-notes:auth-user' }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>(storageKey, null)

  // setUser is a state setter (stable), so these functions never change identity
  const login = useCallback(
    async (username: string, password: string) => {
      const found = password ? await findUserByUsername(username.trim()) : null
      if (!found) throw new Error('Username o password non validi')
      setUser(found)
      return found
    },
    [setUser],
  )

  const logout = useCallback(() => setUser(null), [setUser])

  // Memoized: a new object on every render would re-render every consumer
  const value = useMemo<AuthContextValue>(
    () => ({ user, isAuthenticated: user !== null, login, logout }),
    [user, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

import { createContext, use } from 'react'

/**
 * Creates a context whose hook throws a clear error when used outside its provider,
 * instead of silently returning a default value.
 *
 * @example
 * export const [AuthContext, useAuth] = createStrictContext<AuthValue>('Auth')
 * <AuthContext value={...}>...</AuthContext>   // React 19: the context is the provider
 * const { user } = useAuth()
 */
export function createStrictContext<T>(name: string) {
  const Context = createContext<T | null>(null)
  Context.displayName = name // label shown in React DevTools

  function useStrictContext(): T {
    const value = use(Context)
    if (value === null) {
      throw new Error(`use${name} must be used inside <${name}Provider>`)
    }
    return value
  }

  return [Context, useStrictContext] as const
}

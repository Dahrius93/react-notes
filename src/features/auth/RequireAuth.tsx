import type { ReactNode } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './authContext'

type RequireAuthProps = {
  /** Wrapped content. Without children it renders <Outlet />, so it works as a layout route. */
  children?: ReactNode
  loginPath?: string
}

/**
 * Route guard: renders the protected content only for logged-in users,
 * otherwise redirects to the login page remembering where the user wanted to go.
 *
 * @example
 * // Protects every child route
 * { element: <RequireAuth />, children: [{ path: 'account', Component: AccountPage }] }
 */
export function RequireAuth({ children, loginPath = '/login' }: RequireAuthProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    // replace: the protected URL doesn't stay in the history (Back won't loop)
    // state.from: LoginPage sends the user back here after logging in
    return <Navigate to={loginPath} replace state={{ from: location }} />
  }

  return children ?? <Outlet />
}

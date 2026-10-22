import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, type RouteObject } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from '@/features/auth/AuthProvider'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { createQueryClient } from '@/shared/api/queryClient'

const TEST_AUTH_KEY = 'test:auth-user'

type Options = {
  /** Initial URL, e.g. '/users/1?tab=posts' */
  route?: string
  /** Route pattern the UI is mounted on, so useParams works, e.g. '/users/:id' */
  path?: string
  /** Other routes reachable by navigation, e.g. a fake /login page */
  routes?: RouteObject[]
  /** Logged-in user; omit for an anonymous visitor */
  user?: Partial<User>
}

/**
 * Renders `ui` with everything the app provides: a data router in memory,
 * a fresh TanStack Query client (no retries) and the AuthProvider.
 * Returns Testing Library's result plus a userEvent instance, the router and the client.
 *
 * @example
 * const { user, router } = renderWithProviders(<UserPage />, { route: '/users/1', path: '/users/:id' })
 * await user.click(screen.getByRole('link', { name: 'Indietro' }))
 * expect(router.state.location.pathname).toBe('/users')
 */
export function renderWithProviders(ui: ReactNode, { route = '/', path = '*', routes = [], user }: Options = {}) {
  if (user) localStorage.setItem(TEST_AUTH_KEY, JSON.stringify(user))

  const queryClient = createQueryClient()
  queryClient.setDefaultOptions({ queries: { retry: false } })
  const router = createMemoryRouter([{ path, element: ui }, ...routes], { initialEntries: [route] })

  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider storageKey={TEST_AUTH_KEY}>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  )

  return { ...result, user: userEvent.setup(), router, queryClient }
}

import { createBrowserRouter, type RouteObject } from 'react-router'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { navItems } from './navigation'
import { RootLayout } from './layout/RootLayout'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { PageLoading } from './pages/PageLoading'
import { RouteErrorPage } from './pages/RouteErrorPage'

// Exported separately so tests can mount them in a memory router
export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteErrorPage,
    HydrateFallback: PageLoading,
    children: [
      { index: true, Component: HomePage },

      // Note pages: code-split with `lazy`, the router waits for the chunk before navigating
      ...navItems.map(({ path, title, summary, load }): RouteObject =>
        load
          ? { path, lazy: async () => ({ Component: (await load()).default }) }
          : { path, element: <ComingSoonPage title={title} summary={summary} /> },
      ),

      {
        path: 'login',
        handle: { title: 'Accedi' }, // read by RootLayout with useMatches()
        lazy: async () => ({ Component: (await import('@/features/auth/LoginPage')).default }),
      },

      // Layout route without path: protects every child route
      {
        Component: RequireAuth,
        children: [
          {
            path: 'account',
            handle: { title: 'Il mio account' },
            lazy: async () => ({ Component: (await import('@/features/auth/AccountPage')).default }),
          },
        ],
      },

      { path: '*', Component: NotFoundPage },
    ],
  },
]

export const router = createBrowserRouter(routes)

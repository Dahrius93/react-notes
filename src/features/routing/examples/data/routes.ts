import type { RouteObject } from 'react-router'
import { DataErrorPage, DataLayout, DataLoading, NewPostPage, UserPage, UsersPage } from './components'
import { newPostAction, userLoader, usersLoader } from './loaders'

// Data mode: routes are plain objects, passed to createBrowserRouter(routes)
export const dataRoutes: RouteObject[] = [
  {
    path: '/',
    Component: DataLayout,
    ErrorBoundary: DataErrorPage, // errors of child routes without their own boundary end up here
    HydrateFallback: DataLoading, // shown while the first loaders run
    children: [
      { index: true, loader: usersLoader, Component: UsersPage },
      {
        path: 'users/:userId',
        loader: userLoader,
        Component: UserPage,
        ErrorBoundary: DataErrorPage, // keeps the layout visible on a 404
      },
      { path: 'posts/new', action: newPostAction, Component: NewPostPage },
    ],
  },
]

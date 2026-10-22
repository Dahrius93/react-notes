import type { ReactNode } from 'react'
import { RouterSandbox } from '@/docs/RouterSandbox'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { dataRoutes } from './data/routes'
import { NavLinksApp } from './links/NavLinksApp'
import { NewPostApp } from './navigate/NewPostApp'
import { DashboardApp } from './nested/DashboardApp'
import { UsersApp } from './params/UsersApp'
import { ProtectedApp } from './protected/ProtectedApp'
import { PostsSearch } from './search/PostsSearch'
import { PostsApp } from './slug/PostsApp'

// Each demo mounts an example app in a RouterSandbox (in-memory router + fake address bar).

export function NavLinksDemo() {
  return (
    <RouterSandbox>
      <NavLinksApp />
    </RouterSandbox>
  )
}

export function NestedDemo() {
  return (
    <RouterSandbox initialPath="/dashboard">
      <DashboardApp />
    </RouterSandbox>
  )
}

export function ParamsDemo() {
  return (
    <RouterSandbox initialPath="/users">
      <UsersApp />
    </RouterSandbox>
  )
}

export function SlugDemo() {
  // Opens a post WITHOUT slug: watch the address bar fix itself
  return (
    <RouterSandbox initialPath="/posts/3">
      <PostsApp />
    </RouterSandbox>
  )
}

export function SearchDemo() {
  return (
    <RouterSandbox initialPath="/posts?q=qui&page=1">
      <PostsSearch />
    </RouterSandbox>
  )
}

export function NavigateDemo() {
  return (
    <RouterSandbox>
      <NewPostApp />
    </RouterSandbox>
  )
}

// Separate storage key: logging in here doesn't log you into the notes app
function DemoAuthProvider({ children }: { children: ReactNode }) {
  return <AuthProvider storageKey="react-notes:routing-demo-auth">{children}</AuthProvider>
}

export function ProtectedDemo() {
  return (
    <RouterSandbox wrapper={DemoAuthProvider}>
      <ProtectedApp />
    </RouterSandbox>
  )
}

export function DataDemo() {
  return <RouterSandbox routes={dataRoutes} />
}

import {
  Form,
  isRouteErrorResponse,
  Link,
  NavLink,
  Outlet,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
  useSearchParams,
} from 'react-router'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Spinner } from '@/shared/ui/Spinner'
import { Textarea } from '@/shared/ui/Textarea'
import type { newPostAction, userLoader, usersLoader } from './loaders'

const linkClass = ({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
  cn('text-sm', isActive && 'font-semibold text-sky-700 dark:text-sky-400', isPending && 'animate-pulse text-amber-600')

export function DataLayout() {
  // 'idle' | 'loading' (loaders running) | 'submitting' (action running)
  const navigation = useNavigation()
  const [searchParams] = useSearchParams()
  const createdId = searchParams.get('created')

  return (
    <div className="space-y-4">
      <nav className="flex items-center gap-4 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <NavLink to="/" end className={linkClass}>
          Utenti
        </NavLink>
        <NavLink to="/posts/new" className={linkClass}>
          Nuovo post
        </NavLink>
        {navigation.state !== 'idle' && <Spinner label={navigation.state === 'submitting' ? 'Invio…' : 'Caricamento…'} />}
      </nav>
      {createdId && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          Post #{createdId} creato (JSONPlaceholder finge di salvarlo).
        </p>
      )}
      {/* The old page stays visible (dimmed) while the next one loads */}
      <div className={cn(navigation.state === 'loading' && 'opacity-50 transition-opacity')}>
        <Outlet />
      </div>
    </div>
  )
}

export function UsersPage() {
  // Typed from the loader's return value
  const { users } = useLoaderData<typeof usersLoader>()
  return (
    <ul className="grid gap-1 text-sm sm:grid-cols-2">
      {users.map((user) => (
        <li key={user.id}>
          <Link to={`/users/${user.id}`} className="text-sky-700 hover:underline dark:text-sky-400">
            {user.name}
          </Link>
        </li>
      ))}
      <li>
        <Link to="/users/999" className="text-red-600 hover:underline">
          Utente #999 (404)
        </Link>
      </li>
    </ul>
  )
}

export function UserPage() {
  // No useEffect, no loading state: the data is already here when the component renders
  const { user, posts } = useLoaderData<typeof userLoader>()
  return (
    <div className="space-y-2 text-sm">
      <h2 className="text-lg font-bold">{user.name}</h2>
      <p className="text-zinc-500">{user.email}</p>
      <p className="font-medium">{posts.length} post:</p>
      <ul className="list-disc space-y-0.5 pl-5">
        {posts.slice(0, 4).map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  )
}

export function NewPostPage() {
  const actionData = useActionData<typeof newPostAction>()
  const isSubmitting = useNavigation().state === 'submitting'
  const errors = actionData?.errors

  // <Form> (capital F) sends the data to the route's action instead of reloading the page
  return (
    <Form method="post" className="max-w-sm space-y-3">
      <Input name="title" label="Titolo" error={errors?.title} />
      <Textarea name="body" label="Testo" rows={3} error={errors?.body} />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Invio…' : 'Pubblica'}
      </Button>
    </Form>
  )
}

export function DataErrorPage() {
  const error = useRouteError()

  return (
    <div className="space-y-2 text-sm">
      {isRouteErrorResponse(error) ? (
        // Thrown with data(message, { status })
        <p className="font-semibold text-red-600">
          {error.status} · {String(error.data)}
        </p>
      ) : (
        <p className="font-semibold text-red-600">{error instanceof Error ? error.message : 'Errore sconosciuto'}</p>
      )}
      <Link to="/" className="text-sky-700 hover:underline dark:text-sky-400">
        ← Torna agli utenti
      </Link>
    </div>
  )
}

export function DataLoading() {
  return <Spinner label="Primo caricamento…" />
}

import { request } from '@/shared/api/http'
import { API_URL } from '@/shared/api/jsonplaceholder/config'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { getUsers } from '@/shared/api/jsonplaceholder/users'
import { useAsync } from '@/shared/hooks/useAsync'
import { cn } from '@/shared/lib/cn'
import { sleep } from '@/shared/lib/sleep'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

const statusTone = { idle: 'neutral', pending: 'warning', success: 'success', error: 'danger' } as const

async function loadUsers(fail: boolean): Promise<User[]> {
  await sleep(700) // visible loading state
  // A wrong URL produces a real 404 from JSONPlaceholder
  return fail ? request<User[]>(`${API_URL}/not-found`) : getUsers()
}

export function UsersLoader() {
  const { status, data: users, error, isPending, run, reset } = useAsync<User[]>()

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => run(loadUsers(false))} disabled={isPending}>
          {users ? 'Ricarica' : 'Carica utenti'}
        </Button>
        <Button variant="secondary" onClick={() => run(loadUsers(true))} disabled={isPending}>
          Carica con errore
        </Button>
        <Button variant="ghost" onClick={reset}>
          Reset
        </Button>
        <Badge tone={statusTone[status]} className="ml-auto font-mono">
          status: {status}
        </Badge>
      </div>

      {isPending && <Spinner />}
      {error && <p className="text-sm text-red-600 dark:text-red-400">Errore: {error.message}</p>}

      {/* During a reload the previous data stays visible (dimmed) */}
      {users && (
        <ul className={cn('grid gap-2 sm:grid-cols-2', isPending && 'opacity-50')}>
          {users.map((user) => (
            <li key={user.id} className="rounded-lg bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900">
              <span className="font-medium">{user.name}</span>
              <span className="block text-xs text-zinc-500">{user.email}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

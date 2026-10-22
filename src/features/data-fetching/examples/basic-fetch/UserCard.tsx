import { useState } from 'react'
import { API_URL } from '@/shared/api/jsonplaceholder/config'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { useFetch } from '@/shared/hooks/useFetch'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

export function UserCard() {
  const [userId, setUserId] = useState(1)
  // One line: loading, error, data, abort of old requests, refetch
  const { data: user, error, isPending, refetch } = useFetch<User>(`${API_URL}/users/${userId}`)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 999].map((id) => (
          <Button key={id} size="sm" variant={id === userId ? 'primary' : 'secondary'} onClick={() => setUserId(id)}>
            #{id}
          </Button>
        ))}
        <Button size="sm" variant="ghost" onClick={refetch}>
          ↻ Ricarica
        </Button>
      </div>

      <div className="min-h-20 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
        {isPending && <Spinner />}
        {error && <p className="text-red-600 dark:text-red-400">Errore: {error.message}</p>}
        {user && !isPending && (
          <div>
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-zinc-500">
              {user.email} · {user.company.name}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { userQueries } from '@/shared/api/jsonplaceholder/queries'
import { cn } from '@/shared/lib/cn'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'

const userIds = [1, 2, 3, 4, 5, 6]

export function QueryStates() {
  const queryClient = useQueryClient()
  const [userId, setUserId] = useState(1)

  const { data: user, status, fetchStatus, isPlaceholderData, isStale, dataUpdatedAt } = useQuery({
    ...userQueries.detail(userId),
    // While the new user loads, keep showing the previous one instead of a spinner
    placeholderData: keepPreviousData,
  })

  // Hover = probable click: start loading early. queryClient.query() replaces the deprecated prefetchQuery.
  function prefetch(id: number) {
    queryClient.query(userQueries.detail(id)).catch(() => {})
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {userIds.map((id) => (
          <Button
            key={id}
            size="sm"
            variant={id === userId ? 'primary' : 'secondary'}
            onMouseEnter={() => prefetch(id)}
            onClick={() => setUserId(id)}
          >
            #{id}
          </Button>
        ))}
        <Button
          size="sm"
          variant="ghost"
          // Marks every ['users', ...] query as stale and refetches the ones on screen
          onClick={() => queryClient.invalidateQueries({ queryKey: userQueries.all() })}
        >
          ↻ Invalida ['users']
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 font-mono">
        <Badge tone={status === 'success' ? 'success' : status === 'error' ? 'danger' : 'warning'}>status: {status}</Badge>
        <Badge tone={fetchStatus === 'fetching' ? 'warning' : 'neutral'}>fetchStatus: {fetchStatus}</Badge>
        <Badge tone={isPlaceholderData ? 'warning' : 'neutral'}>isPlaceholderData: {String(isPlaceholderData)}</Badge>
        <Badge tone={isStale ? 'warning' : 'success'}>isStale: {String(isStale)}</Badge>
      </div>

      {user && (
        <div className={cn('rounded-lg bg-zinc-50 p-4 transition-opacity dark:bg-zinc-900', isPlaceholderData && 'opacity-50')}>
          <p className="font-semibold">
            #{user.id} {user.name}
          </p>
          <p className="text-sm text-zinc-500">
            {user.email} · aggiornato alle {new Date(dataUpdatedAt).toLocaleTimeString('it-IT')}
          </p>
        </div>
      )}
    </div>
  )
}

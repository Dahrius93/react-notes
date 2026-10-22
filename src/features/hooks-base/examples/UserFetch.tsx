import { useEffect, useState } from 'react'
import { isAbortError } from '@/shared/api/http'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { getUser } from '@/shared/api/jsonplaceholder/users'
import { cn } from '@/shared/lib/cn'
import { sleep } from '@/shared/lib/sleep'
import { Button } from '@/shared/ui/Button'
import { Spinner } from '@/shared/ui/Spinner'

const userIds = [1, 2, 3, 4, 5, 999] // 999 does not exist → 404

export function UserFetch() {
  const [userId, setUserId] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Demo switches
  const [slowNetwork, setSlowNetwork] = useState(true)
  const [abortOnCleanup, setAbortOnCleanup] = useState(true)

  function selectUser(id: number) {
    // Loading starts here, in the event that causes it, not inside the effect
    setUserId(id)
    setIsLoading(true)
    setError(null)
  }

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller
    // Random latency, so that responses can arrive out of order
    const latency = slowNetwork ? 300 + Math.random() * 1700 : 0

    sleep(latency, signal)
      .then(() => getUser(userId, { signal }))
      .then((data) => {
        setUser(data)
        setIsLoading(false)
      })
      .catch((err: Error) => {
        if (isAbortError(err)) return // cancelled on purpose: not an error
        setUser(null)
        setError(err)
        setIsLoading(false)
      })

    // userId changed (or unmount): cancel the old request so it can't overwrite the new one
    return () => {
      if (abortOnCleanup) controller.abort()
    }
  }, [userId, slowNetwork, abortOnCleanup])

  const isStale = !isLoading && user !== null && user.id !== userId

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {userIds.map((id) => (
          <Button key={id} size="sm" variant={id === userId ? 'primary' : 'secondary'} onClick={() => selectUser(id)}>
            #{id}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={slowNetwork} onChange={(e) => setSlowNetwork(e.target.checked)} />
          Rete lenta (latenza casuale)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={abortOnCleanup} onChange={(e) => setAbortOnCleanup(e.target.checked)} />
          Annulla la richiesta nel cleanup
        </label>
      </div>

      <div
        className={cn(
          'min-h-28 rounded-lg bg-zinc-50 p-4 ring-1 ring-transparent dark:bg-zinc-900',
          isStale && 'ring-red-500',
        )}
      >
        {isLoading && <Spinner className="mb-2" />}
        {error && <p className="text-red-600 dark:text-red-400">Errore: {error.message}</p>}
        {user && (
          <div className={cn(isLoading && 'opacity-50')}>
            <p className="font-semibold">
              #{user.id} {user.name}
            </p>
            <p className="text-sm text-zinc-500">
              {user.email} · {user.company.name}
            </p>
          </div>
        )}
      </div>

      <p className="text-sm text-zinc-500">
        Selezionato: <strong>#{userId}</strong>
        {isStale && (
          <span className="text-red-600 dark:text-red-400">
            {' '}
            — ⚠ race condition: stai vedendo l'utente #{user.id}
          </span>
        )}
      </p>
    </div>
  )
}

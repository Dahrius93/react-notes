import { Suspense, useState } from 'react'
import { Button } from '@/shared/ui/Button'
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary'
import { Spinner } from '@/shared/ui/Spinner'
import { fetchUser } from './userResource'
import { UserProfile } from './UserProfile'

export function UsePromiseDemo() {
  const [userId, setUserId] = useState(1)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 999].map((id) => (
          <Button key={id} size="sm" variant={id === userId ? 'primary' : 'secondary'} onClick={() => setUserId(id)}>
            #{id}
          </Button>
        ))}
      </div>

      <div className="min-h-16 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
        {/* Error Boundary outside, Suspense inside: errors and loading handled declaratively */}
        <ErrorBoundary
          resetKeys={[userId]}
          fallback={({ error }) => <p className="text-red-600 dark:text-red-400">Errore: {error.message}</p>}
        >
          <Suspense fallback={<Spinner label="Caricamento utente…" />}>
            <UserProfile userPromise={fetchUser(userId)} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}

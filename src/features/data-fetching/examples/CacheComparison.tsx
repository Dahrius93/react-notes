import { useQuery } from '@tanstack/react-query'
import { API_URL } from '@/shared/api/jsonplaceholder/config'
import { userQueries } from '@/shared/api/jsonplaceholder/queries'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { useFetch } from '@/shared/hooks/useFetch'
import { useToggle } from '@/shared/hooks/useToggle'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Spinner } from '@/shared/ui/Spinner'

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('it-IT')
}

function WithUseFetch() {
  const { data: users, isPending } = useFetch<User[]>(`${API_URL}/users`)
  return (
    <Card className="space-y-1 text-sm">
      <p className="font-semibold">useFetch</p>
      {/* Every mount = new request + spinner: there is no cache */}
      {isPending ? <Spinner /> : <p>{users?.length} utenti</p>}
    </Card>
  )
}

function WithUseQuery() {
  const { data: users, isPending, isFetching, dataUpdatedAt } = useQuery(userQueries.list())
  return (
    <Card className="space-y-1 text-sm">
      <p className="font-semibold">useQuery</p>
      {/* After the first time: data is shown instantly from the cache */}
      {isPending ? (
        <Spinner />
      ) : (
        <p>
          {users?.length} utenti · dalla cache, scaricati alle {formatTime(dataUpdatedAt)}
          {isFetching && ' · aggiornamento in background…'}
        </p>
      )}
    </Card>
  )
}

export function CacheComparison() {
  const [isVisible, { toggle }] = useToggle(true)

  return (
    <div className="space-y-4">
      <Button onClick={toggle}>{isVisible ? 'Smonta i componenti' : 'Rimonta i componenti'}</Button>
      {isVisible && (
        <div className="grid gap-3 sm:grid-cols-2">
          <WithUseFetch />
          <WithUseQuery />
        </div>
      )}
    </div>
  )
}

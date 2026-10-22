import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { postQueries, userQueries } from '@/shared/api/jsonplaceholder/queries'
import { Spinner } from '@/shared/ui/Spinner'

export function DependentQueries() {
  const [userId, setUserId] = useState<number | null>(null)

  const usersQuery = useQuery(userQueries.list())

  const postsQuery = useQuery({
    // -1 is never fetched: `enabled` keeps the query idle until a user is chosen
    ...postQueries.byUser(userId ?? -1),
    enabled: userId !== null,
    // select: transform the cached data for this component only (the cache keeps all posts)
    select: (posts) => posts.slice(0, 5).map((post) => post.title),
  })

  if (usersQuery.isPending) return <Spinner />
  if (usersQuery.error) return <p className="text-red-600">Errore: {usersQuery.error.message}</p>

  return (
    <div className="grid gap-4 md:grid-cols-[14rem_1fr]">
      <label className="flex flex-col gap-1.5 text-sm font-medium">
        Utente
        <select
          value={userId ?? ''}
          onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : null)}
          className="h-10 rounded-lg bg-white px-3 ring-1 ring-zinc-300 dark:bg-zinc-900 dark:ring-zinc-700"
        >
          <option value="">Scegli…</option>
          {usersQuery.data.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </label>

      <div className="text-sm">
        {userId === null && <p className="text-zinc-500">Scegli un utente: la seconda query parte solo allora.</p>}
        {postsQuery.isFetching && <Spinner />}
        {postsQuery.data && (
          <ol className="list-decimal space-y-1 pl-5">
            {postsQuery.data.map((title) => (
              <li key={title}>{title}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

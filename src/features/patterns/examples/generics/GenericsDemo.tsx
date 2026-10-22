import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { postQueries, userQueries } from '@/shared/api/jsonplaceholder/queries'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { List } from '@/shared/ui/List'
import { Spinner } from '@/shared/ui/Spinner'
import { ItemPicker } from './ItemPicker'

export function GenericsDemo() {
  const users = useQuery(userQueries.list())
  const posts = useQuery({ ...postQueries.list(), select: (all) => all.slice(0, 4) })
  const [selected, setSelected] = useState<User | null>(null)

  if (!users.data || !posts.data) return <Spinner />

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-3">
        {/* T = User: inferred from `items`, getLabel receives a User */}
        <ItemPicker label="Utente" items={users.data} value={selected} onChange={setSelected} getKey={(u) => u.id} getLabel={(u) => u.name} />
        {selected && (
          <p className="text-sm">
            onChange ha restituito un <code>User</code>: {selected.email}, {selected.company.name}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* The same List component with two different types */}
        <List
          items={users.data.slice(0, 3)}
          getKey={(user) => user.id}
          renderItem={(user) => <span className="text-sm font-medium">{user.username}</span>}
        />
        <List
          items={posts.data}
          getKey={(post) => post.id}
          renderItem={(post, index) => (
            <span className="text-sm">
              {index + 1}. {post.title}
            </span>
          )}
        />
        <List items={[]} getKey={() => 0} renderItem={() => null} empty="Lista vuota: si mostra il messaggio “empty”" />
      </div>
    </div>
  )
}

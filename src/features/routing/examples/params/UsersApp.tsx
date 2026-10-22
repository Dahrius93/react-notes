import { useEffect } from 'react'
import { Link, Route, Routes, useParams } from 'react-router'
import type { User } from '@/shared/api/jsonplaceholder/types'
import { getUser, getUsers } from '@/shared/api/jsonplaceholder/users'
import { useAsync } from '@/shared/hooks/useAsync'
import { Spinner } from '@/shared/ui/Spinner'

function UsersList() {
  const { data: users, run } = useAsync<User[]>()
  useEffect(() => void run(getUsers()), [run])

  if (!users) return <Spinner />
  return (
    <ul className="grid gap-1 text-sm sm:grid-cols-2">
      {users.map((user) => (
        <li key={user.id}>
          {/* The id becomes part of the URL */}
          <Link to={`/users/${user.id}`} className="text-sky-700 hover:underline dark:text-sky-400">
            {user.name}
          </Link>
        </li>
      ))}
      <li>
        <Link to="/users/999" className="text-red-600 hover:underline">
          Utente inesistente (#999)
        </Link>
      </li>
    </ul>
  )
}

function UserDetail() {
  // Params are ALWAYS strings (or undefined): convert and validate them
  const { userId } = useParams<{ userId: string }>()
  const id = Number(userId)
  const { data: user, error, isPending, run } = useAsync<User>()

  useEffect(() => {
    if (Number.isInteger(id)) void run(getUser(id))
  }, [id, run])

  if (!Number.isInteger(id)) return <p className="text-red-600">Id non valido: “{userId}”</p>
  if (error) return <p className="text-red-600">Utente #{id} non trovato ({error.message})</p>
  if (isPending || !user) return <Spinner />

  return (
    <div className="space-y-2 text-sm">
      <Link to="/users" className="text-sky-700 hover:underline dark:text-sky-400">
        ← Tutti gli utenti
      </Link>
      <h2 className="text-lg font-bold">{user.name}</h2>
      <p className="text-zinc-500">
        useParams() → <code>{JSON.stringify({ userId })}</code>
      </p>
      <p>
        {user.email} · {user.address.city}
      </p>
    </div>
  )
}

export function UsersApp() {
  return (
    <Routes>
      <Route path="/users" element={<UsersList />} />
      {/* ":userId" is a dynamic segment: it matches /users/1, /users/42, /users/abc... */}
      <Route path="/users/:userId" element={<UserDetail />} />
    </Routes>
  )
}

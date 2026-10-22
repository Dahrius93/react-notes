import { useQuery } from '@tanstack/react-query'
import { getUsers } from '@/shared/api/jsonplaceholder/users'
import { Spinner } from '@/shared/ui/Spinner'

export function UsersList() {
  const { data: users, error, isPending } = useQuery({
    queryKey: ['users'], // unique name of this data in the cache
    queryFn: getUsers, // async function that returns the data
  })

  if (isPending) return <Spinner />
  if (error) return <p className="text-red-600 dark:text-red-400">Errore: {error.message}</p>

  // Here TypeScript knows that `users` is defined (User[])
  return (
    <ul className="grid gap-1 text-sm sm:grid-cols-2">
      {users.map((user) => (
        <li key={user.id}>
          <span className="font-medium">{user.name}</span> <span className="text-zinc-500">· {user.email}</span>
        </li>
      ))}
    </ul>
  )
}

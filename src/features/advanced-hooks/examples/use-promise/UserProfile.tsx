import { use } from 'react'
import type { User } from '@/shared/api/jsonplaceholder/types'

export function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  // Pending → the component "suspends" (the nearest <Suspense> shows its fallback)
  // Rejected → the error goes to the nearest Error Boundary
  // Resolved → `user` is the value: no loading or error state in here
  const user = use(userPromise)

  return (
    <div>
      <p className="font-semibold">{user.name}</p>
      <p className="text-sm text-zinc-500">
        {user.email} · {user.address.city}
      </p>
    </div>
  )
}

import { useNavigate } from 'react-router'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { useAuth } from './authContext'

/** Protected page: rendered only inside <RequireAuth>, so `user` is always there. */
export default function AccountPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Il mio account</h1>
      <Card className="space-y-1">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-zinc-500">
          @{user.username} · {user.email}
        </p>
        <p className="text-sm">
          {user.company.name} · {user.address.city}
        </p>
      </Card>
      <Button
        variant="secondary"
        onClick={async () => {
          // Leave the protected page first: logging out while still here would make
          // RequireAuth redirect to /login. In data routers navigate() returns a Promise.
          await navigate('/', { replace: true })
          logout()
        }}
      >
        Esci
      </Button>
    </div>
  )
}

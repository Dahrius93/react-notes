import { useAuth } from '@/features/auth/authContext'
import { LoginForm } from '@/features/auth/LoginForm'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'

// Neither component receives props: both read the same global context
function ProfileCard() {
  const { user, logout } = useAuth()
  if (!user) return null

  return (
    <Card className="max-w-sm space-y-3">
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-zinc-500">
          @{user.username} · {user.email}
        </p>
      </div>
      <p className="text-sm">
        {user.company.name}, {user.address.city}
      </p>
      <Button variant="secondary" size="sm" onClick={logout}>
        Esci
      </Button>
    </Card>
  )
}

export function AuthDemo() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <ProfileCard /> : <LoginForm />
}

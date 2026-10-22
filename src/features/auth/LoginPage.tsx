import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from './authContext'
import { LoginForm } from './LoginForm'
import { getRedirectPath } from './redirect'

export default function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = getRedirectPath(location.state, '/account')

  return (
    <div className="max-w-sm space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Accedi</h1>

      {user ? (
        <p className="text-sm">
          Hai già effettuato l'accesso come <strong>{user.username}</strong>.{' '}
          <Link to={redirectTo} className="font-medium text-sky-600 hover:text-sky-500">
            Continua →
          </Link>
        </p>
      ) : (
        <>
          {redirectTo !== '/account' && (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              Devi accedere per vedere <code>{redirectTo}</code>.
            </p>
          )}
          {/* After login, go back to the page that required it; replace removes /login from history */}
          <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
        </>
      )}
    </div>
  )
}

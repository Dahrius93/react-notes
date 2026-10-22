import { Link, useNavigate } from 'react-router'
import { Dropdown } from '@/shared/ui/Dropdown'
import { useAuth } from './authContext'

function initials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/** Header widget: "Accedi" link when logged out, user menu when logged in. */
export function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-md px-3 py-1.5 text-sm font-medium text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950"
      >
        Accedi
      </Link>
    )
  }

  return (
    <Dropdown
      variant="ghost"
      align="right"
      label={
        <span className="flex items-center gap-2">
          <span className="grid size-7 place-items-center rounded-full bg-sky-600 text-xs font-bold text-white">
            {initials(user.name)}
          </span>
          <span className="hidden sm:inline">{user.username}</span>
        </span>
      }
      items={[
        { label: 'Il mio account', onSelect: () => navigate('/account') },
        { label: 'Esci', onSelect: logout, danger: true },
      ]}
    />
  )
}

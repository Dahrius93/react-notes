import { NavLink, Outlet, Route, Routes } from 'react-router'
import AccountPage from '@/features/auth/AccountPage'
import { useAuth } from '@/features/auth/authContext'
import LoginPage from '@/features/auth/LoginPage'
import { RequireAuth } from '@/features/auth/RequireAuth'
import { cn } from '@/shared/lib/cn'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn('text-sm', isActive ? 'font-semibold text-sky-700 dark:text-sky-400' : 'text-zinc-600 dark:text-zinc-400')

function Layout() {
  const { user } = useAuth()
  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap items-center gap-4 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/orders" className={linkClass}>
          Ordini 🔒
        </NavLink>
        <NavLink to="/account" className={linkClass}>
          Account 🔒
        </NavLink>
        <span className="ml-auto text-xs text-zinc-500">{user ? `Connesso: ${user.username}` : 'Non connesso'}</span>
      </nav>
      <Outlet />
    </div>
  )
}

const Home = () => <p className="text-sm">Pagina pubblica. Prova ad aprire una pagina con il lucchetto.</p>
const Orders = () => <p className="text-sm">I tuoi ordini (pagina protetta).</p>

export function ProtectedApp() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<LoginPage />} />

        {/* Layout route guard: every child requires login */}
        <Route element={<RequireAuth />}>
          <Route path="orders" element={<Orders />} />
          <Route path="account" element={<AccountPage />} />
        </Route>
      </Route>
    </Routes>
  )
}

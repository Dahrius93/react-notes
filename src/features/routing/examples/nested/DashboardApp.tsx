import { Link, NavLink, Outlet, Route, Routes } from 'react-router'
import { cn } from '@/shared/lib/cn'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn('block rounded px-2 py-1 text-sm', isActive ? 'bg-sky-100 font-medium text-sky-800 dark:bg-sky-950 dark:text-sky-300' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800')

// Layout route (no path): wraps every page with the same header
function SiteLayout() {
  return (
    <div className="space-y-3">
      <header className="flex gap-4 border-b border-zinc-200 pb-2 text-sm font-medium dark:border-zinc-800">
        <Link to="/">Sito</Link>
        <Link to="/dashboard">Dashboard</Link>
      </header>
      {/* Children routes render here */}
      <Outlet />
    </div>
  )
}

// Parent route with a path: its children add segments to /dashboard
function DashboardLayout() {
  return (
    <div className="flex gap-4">
      <aside className="w-32 shrink-0 space-y-1">
        {/* Relative links: resolved from /dashboard */}
        <NavLink to="." end className={linkClass}>
          Panoramica
        </NavLink>
        <NavLink to="settings" className={linkClass}>
          Impostazioni
        </NavLink>
        <NavLink to="billing" className={linkClass}>
          Fatturazione
        </NavLink>
        <NavLink to="missing" className={linkClass}>
          Link rotto
        </NavLink>
      </aside>
      <section className="flex-1 rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-900">
        <Outlet />
      </section>
    </div>
  )
}

const Home = () => <p className="text-sm">Home del sito (route index di /).</p>
const Overview = () => <p>Panoramica: route <strong>index</strong> di /dashboard.</p>
const Settings = () => <p>/dashboard/settings</p>
const Billing = () => <p>/dashboard/billing</p>
const DashboardNotFound = () => <p className="text-red-600">404 dentro la dashboard: il layout resta visibile.</p>
const NotFound = () => <p className="text-sm text-red-600">404 globale.</p>

export function DashboardApp() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="settings" element={<Settings />} />
          <Route path="billing" element={<Billing />} />
          {/* Local 404: only for unknown URLs under /dashboard */}
          <Route path="*" element={<DashboardNotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

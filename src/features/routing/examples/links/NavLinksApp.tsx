import { Link, NavLink, Route, Routes, useLocation } from 'react-router'
import { cn } from '@/shared/lib/cn'

// NavLink passes { isActive, isPending } to className/style/children
function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-md px-3 py-1.5 text-sm',
    isActive ? 'bg-sky-600 text-white' : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
  )
}

function Page({ title }: { title: string }) {
  const location = useLocation()
  return (
    <div className="space-y-2 text-sm">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-zinc-500">
        location.state: <code>{JSON.stringify(location.state)}</code>
      </p>
    </div>
  )
}

export function NavLinksApp() {
  return (
    <div className="space-y-4">
      <nav className="flex flex-wrap gap-1">
        {/* `end`: active only on exactly "/", not on every URL that starts with "/" */}
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>
        <NavLink to="/docs" className={navClass}>
          Docs
        </NavLink>
        <NavLink to="/docs/install" className={navClass}>
          Docs › Installazione
        </NavLink>
      </nav>

      <div className="flex flex-wrap gap-4 text-sm text-sky-700 dark:text-sky-400">
        {/* replace: overwrites the current history entry (Back skips it) */}
        <Link to="/docs" replace>
          Docs (replace)
        </Link>
        {/* state: data passed to the next page, not visible in the URL */}
        <Link to="/docs/install" state={{ from: 'link con state' }}>
          Installazione (con state)
        </Link>
      </div>

      <Routes>
        <Route path="/" element={<Page title="Home" />} />
        <Route path="/docs" element={<Page title="Docs" />} />
        <Route path="/docs/install" element={<Page title="Installazione" />} />
      </Routes>
    </div>
  )
}

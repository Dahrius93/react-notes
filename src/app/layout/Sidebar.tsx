import { NavLink } from 'react-router'
import { cn } from '@/shared/lib/cn'
import { navigation } from '../navigation'

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Sezioni" className="space-y-8">
      {navigation.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-500">{group.title}</p>
          <ul className="space-y-0.5">
            {group.items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors',
                      isActive
                        ? 'bg-sky-50 font-medium text-sky-700 dark:bg-sky-950/50 dark:text-sky-300'
                        : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900',
                    )
                  }
                >
                  {item.title}
                  {!item.load && <span className="text-[10px] uppercase text-zinc-400">presto</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
